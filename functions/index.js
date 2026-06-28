const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const admin = require("firebase-admin");
const md5 = require("md5");
const {
  DEPARTMENTS,
  FINDER_TABS,
  decodeHtml,
  getDepartmentId,
} = require("./shopDepartments.cjs");

const cscSid = defineSecret("CSC_SID");
const cscToken = defineSecret("CSC_TOKEN");
const BASE_URL = "https://api.chattanoogashooting.com/rest/v6";

const CACHE_TTL_MS = 4 * 60 * 60 * 1000;
const CACHE_PATH = "cache/csc-products-v2.json";
const CACHE_V1_PATH = "cache/csc-products.json";
const META_DOC = "csc_product_cache";
const REFRESH_LOCK_MS = 10 * 60 * 1000;

const getAuthHeader = (sid, token) => {
  const hashedToken = md5(token);
  return `Basic ${sid}:${hashedToken}`;
};

const initAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  return admin;
};

const parseCSVLine = (line) => {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === "\"") {
      if (inQuotes && line[i + 1] === "\"") {
        current += "\"";
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current);
  return result.map((v) => v.trim());
};

const parseCSVRecords = (text) => {
  const records = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char === "\"") {
      if (inQuotes && text[i + 1] === "\"") {
        current += "\"";
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && text[i + 1] === "\n") {
        i++;
      }
      if (current.trim()) {
        records.push(current);
      }
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    records.push(current);
  }
  return records;
};

const parseCSV = (text) => {
  const records = parseCSVRecords(text.trim());
  if (!records.length) {
    return [];
  }
  const headers = parseCSVLine(records[0]).map((h) => h.trim());
  return records.slice(1).map((record) => {
    const values = parseCSVLine(record);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });
    return obj;
  });
};

const isValidCategoryName = (name) => {
  if (!name || !/[a-zA-Z]/.test(name)) {
    return false;
  }
  if (/^\d+(\.\d+)?$/.test(name.trim())) {
    return false;
  }
  return true;
};

const parseCategoryPath = (raw) => {
  const parts = (raw || "")
      .split(/[/|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  if (!parts.length) {
    return {parent: "", sub: "", full: ""};
  }
  if (parts.length === 1) {
    return {parent: parts[0], sub: "", full: parts[0]};
  }
  return {
    parent: parts[0],
    sub: parts.slice(1).join(" / "),
    full: parts.join(" / "),
  };
};

const decorateItem = (item) => {
  const parent = decodeHtml(item.parent_category);
  const sub = decodeHtml(item.sub_category);
  return {
    ...item,
    parent_category: parent,
    sub_category: sub,
    category: decodeHtml(item.category),
    department: getDepartmentId(parent, sub),
  };
};

const buildDepartmentCounts = (items) => {
  const counts = {};
  for (const dept of DEPARTMENTS) {
    counts[dept.id] = 0;
  }
  for (const item of items) {
    counts[item.department] = (counts[item.department] || 0) + 1;
  }
  return counts;
};

const buildFilterOptions = (items) => ({
  subcategories: [
    ...new Set(items.map((i) => i.parent_category).filter(Boolean)),
  ].sort(),
  manufacturers: [
    ...new Set(items.map((i) => i.manufacturer).filter(Boolean)),
  ].sort(),
});

const matchesFinder = (item, finderId) => {
  const tab = FINDER_TABS.find((entry) => entry.id === finderId);
  if (!tab) {
    return true;
  }
  return tab.departments.includes(item.department);
};

const buildCategoryTree = (items) => {
  const tree = {};
  for (const item of items) {
    const parent = item.parent_category;
    const sub = item.sub_category;
    if (!parent) {
      continue;
    }
    if (!tree[parent]) {
      tree[parent] = new Set();
    }
    if (sub) {
      tree[parent].add(sub);
    }
  }
  const result = {};
  for (const [parent, subs] of Object.entries(tree)) {
    result[parent] = [...subs].sort();
  }
  return result;
};

const getPrice = (item) => {
  const map = parseFloat((item["MAP"] || "").replace("$", "")) || 0;
  const retail = parseFloat((item["MSRP"] || "").replace("$", "")) || 0;
  const price = parseFloat((item["Price"] || "").replace("$", "")) || 0;
  if (map > 0 && retail > 0) {
    return (((map + retail) / 2) * 0.95).toFixed(2);
  }
  return price.toFixed(2);
};

const mapItem = (item) => {
  const {parent, sub, full} = parseCategoryPath(item["Category"]);
  if (!isValidCategoryName(parent)) {
    return null;
  }
  return {
    sku: item["SKU"],
    name: item["Item Name"] || item["Web Item Name"] || item["Name"] || "",
    description: item["Web Item Description"] || "",
    price: getPrice(item),
    image: item["Image Location"] || "",
    category: full,
    parent_category: parent,
    sub_category: sub,
    manufacturer: item["Manufacturer"] || "",
    stock: parseInt(item["Quantity In Stock"] || item["Stock"] || "0"),
    drop_ship: item["Drop Ship Flag"] === "1",
  };
};

const readGcsCache = async () => {
  const bucket = initAdmin().storage().bucket();
  const file = bucket.file(CACHE_PATH);
  const [exists] = await file.exists();
  if (!exists) {
    return null;
  }
  const [contents] = await file.download();
  return JSON.parse(contents.toString());
};

const writeGcsCache = async (items) => {
  const bucket = initAdmin().storage().bucket();
  const payload = JSON.stringify({
    cachedAt: Date.now(),
    items,
  });
  await bucket.file(CACHE_PATH).save(payload, {
    contentType: "application/json",
    resumable: false,
  });
};

const migrateV1Item = (item) => {
  const {parent, sub, full} = parseCategoryPath(item.category || "");
  if (!isValidCategoryName(parent)) {
    return null;
  }
  return {
    ...item,
    category: full,
    parent_category: parent,
    sub_category: sub,
  };
};

const tryMigrateV1Cache = async () => {
  const bucket = initAdmin().storage().bucket();
  const file = bucket.file(CACHE_V1_PATH);
  const [exists] = await file.exists();
  if (!exists) {
    return null;
  }
  const [contents] = await file.download();
  const v1 = JSON.parse(contents.toString());
  const items = (v1.items || []).map(migrateV1Item).filter(Boolean);
  if (!items.length) {
    return null;
  }
  await writeGcsCache(items);
  console.log(`Migrated v2 cache from v1 (${items.length} items)`);
  return items;
};

const getMetaRef = () =>
  initAdmin().firestore().collection("system").doc(META_DOC);

const tryAcquireRefreshLock = async () => {
  const ref = getMetaRef();
  const now = Date.now();
  return initAdmin().firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.exists ? snap.data() : {};
    const refreshAge = now - (data.refreshStartedAt || 0);
    if (data.refreshing && refreshAge < REFRESH_LOCK_MS) {
      return false;
    }
    tx.set(ref, {refreshing: true, refreshStartedAt: now}, {merge: true});
    return true;
  });
};

const releaseRefreshLock = async (cachedAt) => {
  const update = {refreshing: false};
  if (cachedAt) {
    update.cachedAt = cachedAt;
  }
  await getMetaRef().set(update, {merge: true});
};

const fetchFromCsc = async (sid, token) => {
  const authHeader = getAuthHeader(sid, token);
  const feedUrl = [
    `${BASE_URL}/items/product-feed`,
    "?optional_columns=specifications,gun_model,serialized_flag",
    "&primary_image_only_flag=1",
  ].join("");

  const feedRes = await fetch(feedUrl, {
    headers: {
      "Authorization": authHeader,
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
  });
  const feedText = await feedRes.text();

  if (!feedRes.ok) {
    const err = new Error("CSC product-feed request failed");
    err.status = feedRes.status;
    err.body = feedText;
    throw err;
  }

  const feedJson = JSON.parse(feedText);
  const csvUrl = feedJson.product_feed?.url;
  if (!csvUrl) {
    throw new Error("No feed URL returned from CSC");
  }

  const csvRes = await fetch(csvUrl);
  const csvText = await csvRes.text();
  if (!csvRes.ok) {
    const err = new Error("CSC CSV download failed");
    err.status = csvRes.status;
    err.body = csvText;
    throw err;
  }

  return parseCSV(csvText)
      .filter((item) => {
        const qty = item["Quantity In Stock"] || item["Stock"] || "0";
        return parseInt(qty) > 0;
      })
      .map(mapItem)
      .filter(Boolean);
};

const getCatalog = async (sid, token) => {
  const cached = await readGcsCache();
  const now = Date.now();
  const cacheAge = cached?.cachedAt ? now - cached.cachedAt : Infinity;

  if (cached?.items?.length && cacheAge < CACHE_TTL_MS) {
    console.log("Serving products from GCS cache");
    return cached.items;
  }

  if (!cached?.items?.length) {
    const migrated = await tryMigrateV1Cache();
    if (migrated?.length) {
      return migrated;
    }
  }

  const lockAcquired = await tryAcquireRefreshLock();
  if (!lockAcquired) {
    if (cached?.items?.length) {
      console.log("Refresh in progress — serving stale cache");
      return cached.items;
    }
    throw new Error("Product cache is building. Try again shortly.");
  }

  try {
    console.log("Cache stale or missing — fetching from CSC");
    const items = await fetchFromCsc(sid, token);
    await writeGcsCache(items);
    await releaseRefreshLock(Date.now());
    return items;
  } catch (error) {
    await releaseRefreshLock();
    if (cached?.items?.length) {
      console.warn("CSC fetch failed — serving stale cache", error.message);
      return cached.items;
    }
    if (error.status === 429) {
      const migrated = await tryMigrateV1Cache();
      if (migrated?.length) {
        console.warn("CSC rate limited — serving migrated v1 cache");
        return migrated;
      }
      let errorBody = error.body;
      try {
        errorBody = JSON.parse(error.body);
      } catch (parseError) {
        // keep raw text
      }
      const rateErr = new Error("CSC rate limited and no cache available");
      rateErr.status = 429;
      rateErr.body = errorBody;
      throw rateErr;
    }
    throw error;
  }
};

exports.getProducts = onRequest(
    {
      secrets: [cscSid, cscToken],
      cors: true,
      invoker: "public",
      memory: "1GiB",
      timeoutSeconds: 120,
    },
    async (req, res) => {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      try {
        const sid = cscSid.value();
        const token = cscToken.value();
        let allItems;
        if (req.query.rebuild === "migrate") {
          allItems = await tryMigrateV1Cache();
          if (!allItems?.length) {
            res.status(404).json({
              error: "v1 migration failed — no v1 cache or no valid items",
            });
            return;
          }
        } else {
          allItems = await getCatalog(sid, token);
        }

        const catalog = allItems.map(decorateItem);

        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.per_page) || 24;
        const parent = req.query.parent || "";
        const subcategory = req.query.subcategory || "";
        const search = req.query.search || "";
        const manufacturer = req.query.manufacturer || "";
        const department = req.query.department || "";
        const finder = req.query.finder || "";

        let filtered = catalog;

        if (department) {
          filtered = filtered.filter(
              (i) => i.department === department,
          );
        }

        if (finder) {
          filtered = filtered.filter((i) => matchesFinder(i, finder));
        }

        if (parent) {
          filtered = filtered.filter(
              (i) =>
                i.parent_category.toLowerCase() === parent.toLowerCase(),
          );
        }

        if (subcategory) {
          filtered = filtered.filter(
              (i) =>
                i.sub_category.toLowerCase() === subcategory.toLowerCase(),
          );
        }

        if (manufacturer) {
          filtered = filtered.filter(
              (i) =>
                i.manufacturer.toLowerCase() === manufacturer.toLowerCase(),
          );
        }

        if (search) {
          filtered = filtered.filter((i) =>
            i.name.toLowerCase().includes(search.toLowerCase()),
          );
        }

        const total = filtered.length;
        const pageCount = Math.ceil(total / perPage);
        const start = (page - 1) * perPage;
        const pageItems = filtered.slice(start, start + perPage);

        const categoryTree = buildCategoryTree(catalog);
        const parentCategories = Object.keys(categoryTree).sort();
        const manufacturers = [
          ...new Set(catalog.map((i) => i.manufacturer).filter(Boolean)),
        ].sort();
        const scope = department || finder ?
          catalog.filter((i) => {
            if (department && i.department !== department) {
              return false;
            }
            if (finder && !matchesFinder(i, finder)) {
              return false;
            }
            return true;
          }) :
          catalog;

        res.status(200).json({
          pagination: {page, per_page: perPage, page_count: pageCount, total},
          parent_categories: parentCategories,
          category_tree: categoryTree,
          manufacturers,
          departments: DEPARTMENTS,
          department_counts: buildDepartmentCounts(catalog),
          filter_options: buildFilterOptions(scope),
          items: pageItems,
        });
      } catch (error) {
        console.error("Error:", error);
        const status = error.status || 500;
        res.status(status).json({
          error: error.body || error.message,
        });
      }
    },
);

exports.getAccessories = onRequest(
    {secrets: [cscSid, cscToken], cors: true, invoker: "public"},
    async (req, res) => {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }
      try {
        const sid = cscSid.value();
        const token = cscToken.value();
        const authHeader = getAuthHeader(sid, token);
        const page = req.query.page || 1;
        const perPage = req.query.per_page || 24;
        const url = `${BASE_URL}/items?page=${page}&per_page=${perPage}`;
        const response = await fetch(url, {
          headers: {
            "Authorization": authHeader,
            "Content-Type": "application/json",
            "Accept": "application/json",
          },
        });
        const text = await response.text();
        if (!response.ok) {
          res.status(response.status).json({error: text});
          return;
        }
        res.status(200).json(JSON.parse(text));
      } catch (error) {
        res.status(500).json({error: error.message});
      }
    },
);


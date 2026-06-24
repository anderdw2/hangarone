const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const admin = require("firebase-admin");
const md5 = require("md5");

const cscSid = defineSecret("CSC_SID");
const cscToken = defineSecret("CSC_TOKEN");
const BASE_URL = "https://api.chattanoogashooting.com/rest/v6";

const CACHE_TTL_MS = 4 * 60 * 60 * 1000;
const CACHE_PATH = "cache/csc-products.json";
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

const parseCSV = (text) => {
  const lines = text.trim().split(/\r?\n/);
  const headers = parseCSVLine(lines[0]).map((h) => h.trim());
  return lines.slice(1).filter(Boolean).map((line) => {
    const values = parseCSVLine(line);
    const obj = {};
    headers.forEach((h, i) => {
      obj[h] = values[i] || "";
    });
    return obj;
  });
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

const mapItem = (item) => ({
  sku: item["SKU"],
  name: item["Item Name"] || item["Web Item Name"] || item["Name"] || "",
  description: item["Web Item Description"] || "",
  price: getPrice(item),
  image: item["Image Location"] || "",
  category: item["Category"] || "",
  manufacturer: item["Manufacturer"] || "",
  stock: parseInt(item["Quantity In Stock"] || item["Stock"] || "0"),
  drop_ship: item["Drop Ship Flag"] === "1",
});

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
      .map(mapItem);
};

const getCatalog = async (sid, token) => {
  const cached = await readGcsCache();
  const now = Date.now();
  const cacheAge = cached?.cachedAt ? now - cached.cachedAt : Infinity;

  if (cached?.items?.length && cacheAge < CACHE_TTL_MS) {
    console.log("Serving products from GCS cache");
    return cached.items;
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
        const allItems = await getCatalog(sid, token);

        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.per_page) || 24;
        const category = req.query.category || "";
        const search = req.query.search || "";
        const manufacturer = req.query.manufacturer || "";

        let filtered = allItems;

        if (category) {
          filtered = filtered.filter(
              (i) => i.category.toLowerCase() === category.toLowerCase(),
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

        const categories = [
          ...new Set(allItems.map((i) => i.category).filter(Boolean)),
        ].sort();
        const manufacturers = [
          ...new Set(allItems.map((i) => i.manufacturer).filter(Boolean)),
        ].sort();

        res.status(200).json({
          pagination: {page, per_page: perPage, page_count: pageCount, total},
          categories,
          manufacturers,
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

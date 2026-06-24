#!/usr/bin/env node
/**
 * Build cache/csc-products-v2.json in Firebase Storage.
 * Usage: node scripts/build-cache.js [--fetch]
 *   default: migrate valid items from v1 cache (no CSC call)
 *   --fetch: call CSC product-feed (only when rate limit is clear)
 */
const admin = require("firebase-admin");
const md5 = require("md5");
const {execSync} = require("child_process");

const BASE_URL = "https://api.chattanoogashooting.com/rest/v6";
const CACHE_V1 = "cache/csc-products.json";
const CACHE_V2 = "cache/csc-products-v2.json";

const getAuthHeader = (sid, token) => {
  const hashedToken = md5(token);
  return `Basic ${sid}:${hashedToken}`;
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
      if (char === "\r" && text[i + 1] === "\n") i++;
      if (current.trim()) records.push(current);
      current = "";
    } else {
      current += char;
    }
  }
  if (current.trim()) records.push(current);
  return records;
};

const parseCSV = (text) => {
  const records = parseCSVRecords(text.trim());
  if (!records.length) return [];
  const headers = parseCSVLine(records[0]).map((h) => h.trim());
  return records.slice(1).map((record) => {
    const values = parseCSVLine(record);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = values[i] || ""; });
    return obj;
  });
};

const isValidCategoryName = (name) => {
  if (!name || !/[a-zA-Z]/.test(name)) return false;
  if (/^\d+(\.\d+)?$/.test(name.trim())) return false;
  return true;
};

const parseCategoryPath = (raw) => {
  const parts = (raw || "")
      .split(/[/|]/)
      .map((s) => s.trim())
      .filter(Boolean);
  if (!parts.length) return {parent: "", sub: "", full: ""};
  if (parts.length === 1) return {parent: parts[0], sub: "", full: parts[0]};
  return {
    parent: parts[0],
    sub: parts.slice(1).join(" / "),
    full: parts.join(" / "),
  };
};

const getPrice = (item) => {
  const map = parseFloat((item["MAP"] || "").replace("$", "")) || 0;
  const retail = parseFloat((item["MSRP"] || "").replace("$", "")) || 0;
  const price = parseFloat((item["Price"] || "").replace("$", "")) || 0;
  if (map > 0 && retail > 0) return (((map + retail) / 2) * 0.95).toFixed(2);
  return price.toFixed(2);
};

const mapItem = (item) => {
  const {parent, sub, full} = parseCategoryPath(item["Category"]);
  if (!isValidCategoryName(parent)) return null;
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

const migrateV1Item = (item) => {
  const raw = item.category || "";
  const {parent, sub, full} = parseCategoryPath(raw);
  if (!isValidCategoryName(parent)) return null;
  return {...item, category: full, parent_category: parent, sub_category: sub};
};

const readCache = async (path) => {
  const bucket = admin.storage().bucket();
  const file = bucket.file(path);
  const [exists] = await file.exists();
  if (!exists) return null;
  const [contents] = await file.download();
  return JSON.parse(contents.toString());
};

const writeCache = async (items) => {
  const payload = JSON.stringify({cachedAt: Date.now(), items});
  await admin.storage().bucket().file(CACHE_V2).save(payload, {
    contentType: "application/json",
    resumable: false,
  });
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
    throw new Error(`product-feed ${feedRes.status}: ${feedText.slice(0, 200)}`);
  }
  const csvUrl = JSON.parse(feedText).product_feed?.url;
  if (!csvUrl) throw new Error("No CSV URL in feed response");
  const csvRes = await fetch(csvUrl);
  const csvText = await csvRes.text();
  if (!csvRes.ok) throw new Error(`CSV download ${csvRes.status}`);
  return parseCSV(csvText)
      .filter((row) => parseInt(row["Quantity In Stock"] || "0") > 0)
      .map(mapItem)
      .filter(Boolean);
};

const getSecrets = () => {
  if (process.env.CSC_SID && process.env.CSC_TOKEN) {
    return {sid: process.env.CSC_SID, token: process.env.CSC_TOKEN};
  }
  try {
    const sid = execSync(
        "firebase functions:secrets:access CSC_SID",
        {encoding: "utf8", cwd: `${__dirname}/../..`},
    ).trim();
    const token = execSync(
        "firebase functions:secrets:access CSC_TOKEN",
        {encoding: "utf8", cwd: `${__dirname}/../..`},
    ).trim();
    return {sid, token};
  } catch (err) {
    return null;
  }
};

const main = async () => {
  const useFetch = process.argv.includes("--fetch");
  admin.initializeApp({
    projectId: "hangar-one-precision",
    storageBucket: "hangar-one-precision.firebasestorage.app",
  });

  let items = null;

  if (useFetch) {
    const secrets = getSecrets();
    if (!secrets) throw new Error("Need CSC_SID/CSC_TOKEN env or firebase login");
    console.log("Fetching from CSC product-feed...");
    items = await fetchFromCsc(secrets.sid, secrets.token);
    console.log(`Fetched ${items.length} in-stock products from CSC`);
  } else {
    console.log("Migrating from v1 cache (no CSC call)...");
    const v1 = await readCache(CACHE_V1);
    if (!v1?.items?.length) {
      throw new Error("No v1 cache found. Run with --fetch when CSC rate limit clears.");
    }
    items = v1.items.map(migrateV1Item).filter(Boolean);
    console.log(`Migrated ${items.length} of ${v1.items.length} v1 items`);
  }

  await writeCache(items);
  const parents = [...new Set(items.map((i) => i.parent_category))].sort();
  console.log(`Wrote ${CACHE_V2} (${items.length} items, ${parents.length} departments)`);
  console.log("Sample departments:", parents.slice(0, 10).join(", "));
};

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});

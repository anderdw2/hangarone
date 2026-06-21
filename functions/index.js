const {onRequest} = require("firebase-functions/v2/https");
const {defineSecret} = require("firebase-functions/params");
const md5 = require("md5");

const cscSid = defineSecret("CSC_SID");
const cscToken = defineSecret("CSC_TOKEN");
const BASE_URL = "https://api.chattanoogashooting.com/rest/v6";

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

let cachedFeed = null;
let cacheTime = null;
const CACHE_TTL = 1000 * 60 * 60;

exports.getProducts = onRequest(
    {secrets: [cscSid, cscToken], cors: true, invoker: "public"},
    async (req, res) => {
      if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
      }

      try {
        const now = Date.now();
        if (!cachedFeed || !cacheTime || (now - cacheTime) > CACHE_TTL) {
          const sid = cscSid.value();
          const token = cscToken.value();
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
          let feedJson;
          try {
            feedJson = JSON.parse(feedText);
          } catch (parseError) {
            console.error("Feed parse error:", feedText.slice(0, 500));
            res.status(502).json({error: "Invalid product-feed response"});
            return;
          }

          if (!feedRes.ok) {
            console.error("Feed API error:", feedRes.status, feedText);
            if (feedRes.status === 429 && cachedFeed) {
              console.warn("Rate limited — serving stale cache");
            } else {
              let errorBody = feedText;
              try {
                errorBody = JSON.parse(feedText);
              } catch (parseError) {
                // keep raw text
              }
              res.status(feedRes.status).json({error: errorBody});
              return;
            }
          } else {
            const csvUrl = feedJson.product_feed?.url;

            if (!csvUrl) {
              console.error("No feed URL in response:", feedJson);
              res.status(500).json({
                error: "No feed URL returned",
                feed_response: feedJson,
              });
              return;
            }

            const csvRes = await fetch(csvUrl);
            const csvText = await csvRes.text();
            if (!csvRes.ok) {
              console.error("CSV fetch error:", csvRes.status);
              res.status(csvRes.status).json({
                error: "Failed to fetch product CSV",
              });
              return;
            }
            const parsed = parseCSV(csvText);

            cachedFeed = parsed.filter((item) => {
              const qty = item["Quantity In Stock"] || item["Stock"] || "0";
              const stock = parseInt(qty);
              return stock > 0;
            });
            cacheTime = now;
          }
        }

        const page = parseInt(req.query.page) || 1;
        const perPage = parseInt(req.query.per_page) || 24;
        const category = req.query.category || "";
        const search = req.query.search || "";
        const manufacturer = req.query.manufacturer || "";

        let filtered = cachedFeed;

        if (category) {
          filtered = filtered.filter((i) =>
            (i["Category"] || "").toLowerCase() === category.toLowerCase(),
          );
        }

        if (manufacturer) {
          filtered = filtered.filter((i) =>
            (i["Manufacturer"] || "").toLowerCase() ===
            manufacturer.toLowerCase(),
          );
        }

        if (search) {
          filtered = filtered.filter((i) =>
            (i["Item Name"] || i["Name"] || "")
                .toLowerCase()
                .includes(search.toLowerCase()),
          );
        }

        const total = filtered.length;
        const pageCount = Math.ceil(total / perPage);
        const start = (page - 1) * perPage;
        const pageItems = filtered.slice(start, start + perPage);

        const categories = [
          ...new Set(cachedFeed.map((i) => i["Category"]).filter(Boolean)),
        ].sort();
        const manufacturers = [
          ...new Set(cachedFeed.map((i) => i["Manufacturer"]).filter(Boolean)),
        ].sort();

        res.status(200).json({
          pagination: {page, per_page: perPage, page_count: pageCount, total},
          categories,
          manufacturers,
          items: pageItems.map((item) => ({
            sku: item["SKU"],
            name: item["Item Name"] || item["Name"],
            price: getPrice(item),
            image: item["Image Location"] || "",
            category: item["Category"] || "",
            manufacturer: item["Manufacturer"] || "",
            stock: parseInt(item["Quantity In Stock"] || item["Stock"] || "0"),
            drop_ship: item["Drop Ship Flag"] === "1",
          })),
        });
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({error: error.message});
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

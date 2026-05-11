import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import productsHandler from "./api/products.js";
import categoriesHandler from "./api/categories.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

const apiRoutes = {
  "/api/products": productsHandler,
  "/api/categories": categoriesHandler,
};

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".ico": "image/x-icon",
};

function enhanceRes(res) {
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(data));
    return res;
  };
  return res;
}

async function serveStatic(res, urlPath) {
  const rel = urlPath === "/" ? "/index.html" : urlPath;
  const filePath = path.join(__dirname, decodeURIComponent(rel));

  if (!filePath.startsWith(__dirname)) {
    res.statusCode = 403;
    res.end("Forbidden");
    return;
  }

  let finalPath = filePath;
  try {
    const stat = await fs.promises.stat(finalPath);
    if (stat.isDirectory()) finalPath = path.join(finalPath, "index.html");
  } catch {
    res.statusCode = 404;
    res.end("Not found");
    return;
  }

  try {
    const data = await fs.promises.readFile(finalPath);
    const ext = path.extname(finalPath).toLowerCase();
    res.setHeader("Content-Type", MIME[ext] || "application/octet-stream");
    res.end(data);
  } catch {
    res.statusCode = 500;
    res.end("Server error");
  }
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  enhanceRes(res);

  const handler = apiRoutes[url.pathname];
  if (handler) {
    req.query = Object.fromEntries(url.searchParams);
    try {
      await handler(req, res);
    } catch (err) {
      console.error("[api error]", err);
      if (!res.headersSent) res.status(500).json({ error: "Internal server error" });
    }
    return;
  }

  if (url.pathname.startsWith("/api/")) {
    res.status(404).json({ error: "Not found" });
    return;
  }

  await serveStatic(res, url.pathname);
});

server.listen(PORT, () => {
  console.log(`\n  ShopLite running at  http://localhost:${PORT}\n`);
});

const http = require("node:http");
const crypto = require("node:crypto");
const fs = require("node:fs");
const path = require("node:path");
const { URL } = require("node:url");
const { Pool } = require("pg");

const root = __dirname;
const dataDir = path.join(root, "data");
const dataFile = path.join(dataDir, "site.json");
const port = Number(process.env.PORT || 5174);
const adminEmail = process.env.ADMIN_EMAIL || "contact@ghmass-baladi.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Ghmass2026$";
const sessions = new Set();

// Supabase PostgreSQL Connection Pool
const dbUrl = process.env.DATABASE_URL || "postgresql://postgres:CI8FYeO8Lxa2cF9H@db.ijyidjhsixumlomobjpt.supabase.co:5432/postgres";
let pool;
try {
  pool = new Pool({
    connectionString: dbUrl,
    ssl: dbUrl.includes("supabase.co") ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
  });
} catch (e) {
  console.error("Failed to initialize database pool:", e);
}

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function readFallbackMenu() {
  const previousWindow = global.window;
  global.window = {};
  delete require.cache[require.resolve("./menu-data.js")];
  require("./menu-data.js");
  const menu = global.window.GHMAAS_MENU || [];
  global.window = previousWindow;
  return menu;
}

function defaultSite() {
  return {
    brandName: "غماس بلدي",
    tagline: "أكل على الشوارب",
    heroLocation: "عمان - شارع المدينة المنورة",
    heroDescription:
      "شغلتنا و عملتنا الاكل الي على الشوارب. منيو عربي فخم للأطباق البلدية، المشاوي، الصواني، الساندويشات، والمشروبات بأسعار واضحة وصور حقيقية.",
    heroImages: [
      "https://amenomenu.com/images/products_images/1855308504936711.webp",
      "https://amenomenu.com/images/products_images/1849153101176320.webp",
      "https://amenomenu.com/images/products_images/1855308643606587.webp",
    ],
    logo: "https://amenomenu.com/images/users_logos/417_1763249008.png",
    phone: "0798181200",
    phoneInternational: "+962798181200",
    whatsapp: "962798181200",
    instagram: "https://www.instagram.com/ghmaas.baladi_jordan/",
    facebook: "https://www.facebook.com/profile.php?id=61568075303841",
    mapUrl: "https://maps.app.goo.gl/UJLZoKhrjdQJPzec7?g_st=ic",
    taxNote: "يضاف 8% ضريبة مبيعات على الأسعار.",
    dedication: "إهداء من <a href=\"https://www.dahabweb.com\" target=\"_blank\" rel=\"noreferrer\" class=\"gold-link\" style=\"color: var(--gold); text-decoration: underline; font-weight: 800;\">مؤسسة المسار الذهبي</a> تقديرًا لموقفهم مع النشامى",
    sourceNote: "",
    branches: [
      {
        title: "شارع المدينة المنورة",
        address: "عمان - الأردن",
        mapUrl: "https://maps.app.goo.gl/UJLZoKhrjdQJPzec7?g_st=ic",
        image: "./branch_madina.png",
        featured: true,
      },
      {
        title: "شارع مكة",
        address: "مجمع الداوود - عمان",
        mapUrl: "",
        image: "./branch_mecca.png",
        featured: false,
      },
      {
        title: "طبربور",
        address: "دوار الدبابة - عمان",
        mapUrl: "",
        image: "./branch_tabarbour.png",
        featured: false,
      },
    ],
    menu: readFallbackMenu(),
    updatedAt: new Date().toISOString(),
  };
}

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(defaultSite(), null, 2), "utf8");
  }
}

function readSite() {
  ensureDataFile();
  return JSON.parse(fs.readFileSync(dataFile, "utf8"));
}

function writeSite(site) {
  const next = {
    ...site,
    sourceNote: "",
    updatedAt: new Date().toISOString(),
  };
  if (!Array.isArray(next.menu)) next.menu = [];
  if (!Array.isArray(next.branches)) next.branches = [];
  if (!Array.isArray(next.heroImages)) next.heroImages = [];
  fs.writeFileSync(dataFile, JSON.stringify(next, null, 2), "utf8");
  return next;
}

async function readSiteDb() {
  if (pool) {
    try {
      const result = await pool.query("SELECT data FROM public.site_settings WHERE id = 1;");
      if (result.rows.length > 0) {
        return result.rows[0].data;
      }
    } catch (error) {
      console.error("Database read error, falling back to local file:", error);
    }
  }
  return readSite();
}

async function writeSiteDb(site) {
  const next = {
    ...site,
    sourceNote: "",
    updatedAt: new Date().toISOString(),
  };
  if (!Array.isArray(next.menu)) next.menu = [];
  if (!Array.isArray(next.branches)) next.branches = [];
  if (!Array.isArray(next.heroImages)) next.heroImages = [];

  try {
    fs.writeFileSync(dataFile, JSON.stringify(next, null, 2), "utf8");
  } catch (err) {
    console.error("Failed to write local backup site.json:", err);
  }

  if (pool) {
    try {
      await pool.query(
        "INSERT INTO public.site_settings (id, data, updated_at) VALUES (1, $1, now()) ON CONFLICT (id) DO UPDATE SET data = $1, updated_at = now();",
        [JSON.stringify(next)]
      );
    } catch (error) {
      console.error("Database write error:", error);
    }
  }
  return next;
}

function sendJson(res, status, body, headers = {}) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    ...headers,
  });
  res.end(JSON.stringify(body));
}

function sendText(res, status, message) {
  res.writeHead(status, { "content-type": "text/plain; charset=utf-8" });
  res.end(message);
}

function getCookies(req) {
  const header = req.headers.cookie || "";
  return Object.fromEntries(
    header
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      }),
  );
}

function isAuthed(req) {
  const token = getCookies(req).ghmaas_admin;
  return Boolean(token && sessions.has(token));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 5_000_000) {
        reject(new Error("Request body is too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function safeFilePath(pathname) {
  const cleanPath = pathname === "/" ? "/index.html" : pathname;
  const filePath = path.normalize(path.join(root, cleanPath));
  if (!filePath.startsWith(root) || filePath.startsWith(dataDir)) return null;
  return filePath;
}

async function handleApi(req, res, pathname) {
  if (req.method === "GET" && pathname === "/api/site") {
    sendJson(res, 200, await readSiteDb());
    return true;
  }

  if (req.method === "GET" && pathname === "/api/me") {
    sendJson(res, 200, { authenticated: isAuthed(req) });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/login") {
    const body = await readBody(req);
    if (body.email !== adminEmail || body.password !== adminPassword) {
      sendJson(res, 401, { error: "البريد الإلكتروني أو كلمة المرور غير صحيحة" });
      return true;
    }
    const token = crypto.randomBytes(32).toString("hex");
    sessions.add(token);
    sendJson(res, 200, { authenticated: true }, {
      "set-cookie": `ghmaas_admin=${token}; HttpOnly; SameSite=Lax; Path=/; Max-Age=86400`,
    });
    return true;
  }

  if (req.method === "POST" && pathname === "/api/logout") {
    const token = getCookies(req).ghmaas_admin;
    if (token) sessions.delete(token);
    sendJson(res, 200, { authenticated: false }, {
      "set-cookie": "ghmaas_admin=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0",
    });
    return true;
  }

  if ((req.method === "PUT" || req.method === "POST") && pathname === "/api/site") {
    if (!isAuthed(req)) {
      sendJson(res, 401, { error: "يلزم تسجيل الدخول للأدمن" });
      return true;
    }
    const body = await readBody(req);
    sendJson(res, 200, await writeSiteDb(body));
    return true;
  }

  if (req.method === "POST" && pathname === "/api/upload") {
    if (!isAuthed(req)) {
      sendJson(res, 401, { error: "يلزم تسجيل الدخول للأدمن" });
      return true;
    }
    const url = new URL(req.url, `http://${req.headers.host}`);
    const filename = url.searchParams.get("filename") || "upload.png";
    const safeFilename = path.basename(filename).replace(/[^a-zA-Z0-9.-]/g, "_");

    // Unique filename using a timestamp prefix to avoid conflicts
    const uniqueFilename = `${Date.now()}_${safeFilename}`;
    const ext = path.extname(safeFilename).toLowerCase();
    const mime = mimeTypes[ext] || "image/png";

    // Read the incoming binary upload payload fully into memory
    const chunks = [];
    for await (const chunk of req) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    if (pool) {
      try {
        await pool.query(
          "INSERT INTO public.uploaded_images (name, mime_type, content) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET mime_type = $2, content = $3;",
          [uniqueFilename, mime, buffer]
        );
        sendJson(res, 200, { url: `/uploads/${uniqueFilename}` });
        return true;
      } catch (error) {
        console.error("Failed to upload image to database:", error);
        sendJson(res, 500, { error: `فشل الرفع لقاعدة البيانات: ${error.message}` });
        return true;
      }
    }

    try {
      // Fallback: local disk storage
      const uploadsDir = path.join(root, "uploads");
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const targetPath = path.join(uploadsDir, uniqueFilename);
      fs.writeFileSync(targetPath, buffer);

      sendJson(res, 200, { url: `/uploads/${uniqueFilename}` });
      return true;
    } catch (error) {
      console.error("Failed local fallback write:", error);
      sendJson(res, 500, { error: `فشل حفظ الملف محلياً: ${error.message}` });
      return true;
    }
  }

  return false;
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = decodeURIComponent(url.pathname);

    if (pathname.startsWith("/api/")) {
      const handled = await handleApi(req, res, pathname);
      if (!handled) sendJson(res, 404, { error: "Not found" });
      return;
    }

    const requestedPath = pathname === "/admin" ? "/admin.html" : pathname;

    // Handle uploaded file serving from Database with Disk Fallback
    if (requestedPath.startsWith("/uploads/")) {
      const filename = path.basename(requestedPath);
      if (pool) {
        try {
          const result = await pool.query(
            "SELECT content, mime_type FROM public.uploaded_images WHERE name = $1;",
            [filename]
          );
          if (result.rows.length > 0) {
            const row = result.rows[0];
            res.writeHead(200, {
              "content-type": row.mime_type,
              "cache-control": "public, max-age=31536000, immutable",
            });
            res.end(row.content);
            return;
          }
        } catch (error) {
          console.error("Error reading image from database:", error);
        }
      }

      // Local disk fallback
      const localFilePath = path.join(root, "uploads", filename);
      if (fs.existsSync(localFilePath)) {
        const extension = path.extname(localFilePath).toLowerCase();
        res.writeHead(200, {
          "content-type": mimeTypes[extension] || "application/octet-stream",
          "cache-control": "public, max-age=31536000, immutable",
        });
        fs.createReadStream(localFilePath).pipe(res);
        return;
      }

      sendText(res, 404, "Upload not found");
      return;
    }

    const filePath = safeFilePath(requestedPath);
    if (!filePath || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      sendText(res, 404, "Not found");
      return;
    }

    const extension = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "content-type": mimeTypes[extension] || "application/octet-stream",
      "cache-control": extension === ".html" ? "no-store" : "public, max-age=60",
    });
    fs.createReadStream(filePath).pipe(res);
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

ensureDataFile();
server.listen(port, () => {
  console.log(`Ghmaas Baladi web app: http://localhost:${port}`);
  console.log(`Admin panel: http://localhost:${port}/admin`);
});

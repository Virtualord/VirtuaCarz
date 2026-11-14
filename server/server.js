import express from "express";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "./config/env.js";
import { connectDb } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import carRoute from "./routes/carRoute.js";
import bookingRoute from "./routes/bookingRoute.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const clientDist = path.resolve(__dirname, "../client/dist");
const adminDist = path.resolve(__dirname, "../admin-panel/dist");
const clientIndex = path.join(clientDist, "index.html");
const adminIndex = path.join(adminDist, "index.html");
// Read once at boot; __SITE_URL__ is replaced with the request's origin so
// Open Graph, canonical, and structured-data URLs stay absolute in production.
const clientIndexHtml = fs.existsSync(clientIndex)
  ? fs.readFileSync(clientIndex, "utf8")
  : null;

// database (connect in the background so the API can boot without blocking)
connectDb().catch(() => {
  console.error(
    "The API is running without a database connection. Check MONGO_URI in server/.env.".red
  );
});

// rest obj
const app = express();

// Render terminates TLS at its proxy, so trust the forwarded protocol/host.
app.set("trust proxy", 1);

// middlewares
app.disable("x-powered-by");
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// health check for the hosting platform
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    status: "ok",
    uptime: process.uptime(),
  });
});

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/car", carRoute);
app.use("/api/v1/booking", bookingRoute);

// unknown API routes must not fall through to the frontend HTML
app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// admin panel (built with base /admin/)
if (fs.existsSync(adminIndex)) {
  app.use("/admin", express.static(adminDist));
  app.use("/admin", (req, res) => {
    res.sendFile(adminIndex);
  });
} else {
  app.use("/admin", (req, res) => {
    res
      .status(503)
      .send("Admin panel build not found. Run `npm run build` from the project root.");
  });
}

// customer storefront
if (clientIndexHtml) {
  app.get("/index.html", (req, res) => {
    res.redirect(301, "/");
  });
  // index: false lets the fallback below inject the request origin into the HTML.
  app.use(express.static(clientDist, { index: false }));
  app.use((req, res, next) => {
    if (req.path.startsWith("/api")) return next();

    const rawHost = req.get("host") || "";
    const host = /^[a-z0-9.-]+(?::\d+)?$/i.test(rawHost)
      ? rawHost
      : `localhost:${process.env.PORT || 8080}`;
    const siteUrl = `${req.protocol === "https" ? "https" : "http"}://${host}`;

    res
      .set("Cache-Control", "public, max-age=0, must-revalidate")
      .type("html")
      .send(clientIndexHtml.replaceAll("__SITE_URL__", siteUrl));
  });
} else {
  app.get("/", (req, res) => {
    res.status(200).send("<h1> Welcome to car server </h1>");
  });
}

if (!fs.existsSync(clientIndex) || !fs.existsSync(adminIndex)) {
  console.log(
    "Frontend builds not found. Run `npm run build` to serve the SPAs from this server."
      .yellow
  );
}

// port
const PORT = process.env.PORT || 8080;
const HOST = process.env.HOST || "0.0.0.0";

// listen
app.listen(PORT, HOST, () => {
  console.log(
    `Server Running on ${HOST}:${PORT} in ${process.env.DEV_MODE} Mode`.bgBlue
  );
});

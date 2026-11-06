import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Always load server/.env, even when the app is launched from the repo root.
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const REQUIRED_ENV = ["MONGO_URI", "JWT_SECRET"];
const missing = REQUIRED_ENV.filter((key) => !process.env[key]);

if (missing.length > 0) {
  console.error(
    [
      "",
      "Missing required environment variables: " + missing.join(", "),
      "",
      "Create server/.env from server/.env.example and set the values:",
      "  cp server/.env.example server/.env",
      "",
    ].join("\n")
  );
  process.exit(1);
}

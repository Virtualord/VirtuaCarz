import express from "express";
import colors from "colors";
import cors from "cors";
import morgan from "morgan";
import "./config/env.js";
import { connectDb } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import carRoute from "./routes/carRoute.js";
import bookingRoute from "./routes/bookingRoute.js";

// database (connect in the background so the API can boot without blocking)
connectDb().catch(() => {
  console.error(
    "The API is running without a database connection. Check MONGO_URI in server/.env.".red
  );
});

// rest obj
const app = express();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/car", carRoute);
app.use("/api/v1/booking", bookingRoute);

app.get("/", (req, res) => {
  res.status(200).send("<h1> Welcome to car server </h1>");
});

// port
const PORT = process.env.PORT || 8080;
// listen
app.listen(PORT, () => {
  console.log(
    `Server Running on Port ${PORT} in ${process.env.DEV_MODE} Mode`.bgBlue
  );
});

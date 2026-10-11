import express from "express";
import { isAdmin, userAuth } from "../middleware/authMiddleware.js";
import { addCar, deleteCar, getAllCars, getCarDetails, updateCar } from "../controllers/carController.js";
import upload from "../middleware/multer.js";

const router = express.Router();

// Add car || POST
router.post("/add-car", userAuth, isAdmin,upload.single("image"), addCar);

// Get All cars || GET
router.get("/get-all", getAllCars);

// Get car by ID || GET
router.get("/:id", getCarDetails);

// Update || PATCH
router.patch("/update-car/:id", userAuth, isAdmin, upload.single("image"), updateCar);

// Delete || DELETE
router.delete("/delete-car/:id", userAuth, isAdmin, deleteCar);

export default router;
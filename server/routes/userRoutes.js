import express from "express"
import { getUser, login, register, updateUser } from "../controllers/userController.js"
import { userAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

// Register || POST
router.post("/register", register);

// Login || POST
router.post("/login", login);

// Get current user || GET
router.get("/get-user", userAuth, getUser);

// Update || PATCH
router.patch("/update/:id", userAuth, updateUser)

export default router;
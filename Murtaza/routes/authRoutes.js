import express from "express";
import { registerOneUser, authenticateUser } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerOneUser);
router.post("/login", authenticateUser);

export default router;

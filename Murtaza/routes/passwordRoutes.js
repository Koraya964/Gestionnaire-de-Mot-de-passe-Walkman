import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { registerPassword, getAllPasswords, getOnePassword } from "../controllers/passwordController.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", registerPassword);
router.get("/", getAllPasswords);
router.get("/:id", getOnePassword);

export default router;

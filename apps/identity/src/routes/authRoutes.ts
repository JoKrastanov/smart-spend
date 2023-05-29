import express from "express";
import { AuthController } from "../controllers/authController";

const router = express.Router();
const authController = new AuthController();

router.post("/login", authController.logIn);
router.post("/register", authController.register);
router.get("/user/:userId", authController.getUser);
router.get("/money", authController.freeMoney);

export { router as authRoutes };

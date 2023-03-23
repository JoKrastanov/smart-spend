import express from "express";
import { LicenseController } from "../controllers/licenseController";

const router = express.Router();
const licenseController = new LicenseController()

router.post('/register', licenseController.register)

export { router as licenseRouter };

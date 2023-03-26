import express from "express";
import { LicenseController } from "../controllers/licenseController";

const router = express.Router();
const licenseController = new LicenseController();

router.get('/', licenseController.getAllLicenses);
router.post("/subscribe/:companyId", licenseController.subscribe);


export { router as licenseRouter };

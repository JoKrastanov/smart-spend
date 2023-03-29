import express from "express";
import { LicenseController } from "../controllers/licenseController";

const router = express.Router();
const licenseController = new LicenseController();

router.get("/", licenseController.getAllLicenses);
router.post("/subscribe/:companyId", licenseController.subscribe);
router.put("/:companyId/register/employee", licenseController.registerEmployee);
router.put("/:companyId/register/bank-account", licenseController.registerBankAccount);
router.put("/activate/:companyId", licenseController.activate);

export { router as licenseRouter };

import express from "express";
import { LicenseController } from "../controllers/licenseController";

const router = express.Router();
const licenseController = new LicenseController();

router.post("/subscribe/basic/:companyId", licenseController.subscribeBasic);
router.post("/subscribe/pro/:companyId", licenseController.subscribePro);
router.post(
  "/subscribe/enterprise/:companyId",
  licenseController.subscribeEnterprise
);

export { router as licenseRouter };

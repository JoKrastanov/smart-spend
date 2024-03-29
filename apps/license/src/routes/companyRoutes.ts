import express from "express";
import { CompanyController } from "../controllers/companyController";

const router = express.Router();
const companyController = new CompanyController();

router.post("/register", companyController.registerCompany);
router.get("/companies", companyController.getAllCompanies);
router.get("/:id", companyController.getCompany);
router.delete("/:id", companyController.deleteCompany);

export { router as companyRouter };

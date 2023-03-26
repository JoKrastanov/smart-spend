import express from "express";
import { CompanyController } from "../controllers/companyController";

const router = express.Router();
const companyController = new CompanyController();

router.post("/register", companyController.registerCompany);
router.get("/companies", companyController.getAllCompanies);
router.get("/:id", companyController.getCompany);
router.put("/:id/register/employee", companyController.registerEmployee);
router.put("/:id/register/bank", companyController.registerCompany);

export { router as companyRouter };

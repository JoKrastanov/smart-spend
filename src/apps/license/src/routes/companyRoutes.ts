import express from "express";
import { CompanyController } from "../controllers/companyController";

const router = express.Router();
const companyController = new CompanyController();

router.post('/register', companyController.registerCompany)

export { router as companyRouter };

import express from "express";
import { BankAccountController } from "../controllers/bankAccountController";

const router = express.Router();
const bankController = new BankAccountController();

router.get("/", bankController.getAllBankAccounts);
router.post("/", bankController.addBankAccount);
router.get("/:IBAN", bankController.getByIBAN);
router.get("/company/:companyId", bankController.getByCompany);
router.get("/company/:companyId/department/:department", bankController.getByCompanyAndDepartment);
router.post("/:IBAN/send", bankController.sendMoney);
router.get("/transactions/:IBAN", bankController.getTransactions);

export { router as bankAccountRouter };

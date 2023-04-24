import express from "express";
import { BankAccountController } from "../controllers/bankAccountController";

const router = express.Router();
const bankController = new BankAccountController();

router.get('/', bankController.getAllBankAccounts)
router.get("/:IBAN", bankController.getByIBAN);
router.post("/:IBAN/send", bankController.sendMoney);
router.get("/test/get", bankController.test)

export { router as bankAccountRouter };

import express from "express";
import { BankAccountController } from "../controllers/bankAccountController";

const router = express.Router();
const bankController = new BankAccountController();

router.get("/:IBAN", bankController.getByCompany);
router.post("/:IBAN/send", bankController.sendMoney);

export { router as bankAccountRouter };

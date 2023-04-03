import { Request, Response } from "express";
import { BankAccountService } from "../services/bankAccountService";
import { Money } from "../models/money";

export class BankAccountController {
  private bankService: BankAccountService;

  constructor() {
    this.bankService = new BankAccountService();
  }

  getByCompany = (req: Request, res: Response) => {
    const { IBAN } = req.params;
    const company = this.bankService.getBankAccount(IBAN);
    if (!company) {
      res.sendStatus(404);
      return;
    }
    res.status(200).send(company);
  };

  getAllCompanies = (req: Request, res: Response) => {
    const companies = this.bankService.getBankAccounts();
    res.status(200).send(companies);
  };

  sendMoney = async (req: Request, res: Response) => {
    const { IBAN } = req.params;
    const { IBANReciever, amount} = req.body;
    const sendStatus = await this.bankService.transferMoney(
      IBAN,
      IBANReciever,
      amount
    );
    if (!sendStatus) {
      res.status(500).json({ message: "Error sending money" });
      return;
    }
    res.status(200).json({ message: "Money sent successfully" });
  };
}

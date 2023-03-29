import { Request, Response } from "express";
import { BankAccountService } from "../services/bankAccountService";

export class BankAccountController {
  private bankService: BankAccountService;

  constructor() {
    this.bankService = new BankAccountService();
  }

  getByCompany = (req: Request, res: Response) => {
    const { IBAN } = req.params;
    const company = this.bankService.getCompany(IBAN);
    if (!company) {
      res.sendStatus(404);
      return;
    }
    res.status(200).send(company);
  };

  getAllCompanies = (req: Request, res: Response) => {
    const companies = this.bankService.getCompanies();
    res.status(200).send(companies);
  };
}

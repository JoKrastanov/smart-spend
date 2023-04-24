import { Request, Response } from "express";
import { BankAccountService } from "../services/bankAccountService";

export class BankAccountController {
  private service: BankAccountService;

  constructor() {
    this.service = new BankAccountService();
  }

  getByIBAN = async (req: Request, res: Response) => {
    try {
      const { token, refresh } = req.headers;
      if (
        !(await this.service.verifyBearerToken(
          token as string,
          refresh as string
        ))
      ) {
        return res.status(401).send("Unauthorized request");
      }
      const { IBAN } = req.params;
      const company = await this.service.getBankAccount(IBAN);
      if (!company) {
        res.status(404).json({ message: "This bank account does not exist." });
        return;
      }
      res.status(200).send(company);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  getAllBankAccounts = async (req: Request, res: Response) => {
    try {
      const { token, refresh } = req.headers;
      if (
        !(await this.service.verifyBearerToken(
          token as string,
          refresh as string
        ))
      ) {
        return res.status(401).send("Unauthorized request");
      }
      const companies = await this.service.getBankAccounts();
      res.status(200).send(companies);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  sendMoney = async (req: Request, res: Response) => {
    try {
      const { token, refresh } = req.headers;
      if (
        !(await this.service.verifyBearerToken(
          token as string,
          refresh as string
        ))
      ) {
        return res.status(401).send("Unauthorized request");
      }
      const { IBAN } = req.params;
      const { IBANReciever, amount } = req.body;
      const sendStatus = await this.service.transferMoney(
        IBAN,
        IBANReciever,
        amount
      );
      if (!sendStatus) {
        res.status(500).json({ message: "Error sending money" });
        return;
      }
      res.status(200).json({ message: "Money sent successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  test = async (req: Request, res: Response) => {
    try {
      console.log("Testing");
      await this.service.test();
      res.status(200).json({ message: "OK" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
}

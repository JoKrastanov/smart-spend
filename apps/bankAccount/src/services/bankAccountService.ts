import dotenv from "dotenv";
import { JWTAuthentication } from "authentication-validation/lib";

import { generateUUID } from "../helpers/generateUUID";
import { BankAccount } from "../models/bankAccount";
import { Money } from "../models/money";
import { RabbitMQService } from "./RabbitMQService";

dotenv.config();

export class BankAccountService {
  private bankAccounts: BankAccount[];
  private jwtAuth;
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.bankAccounts = [];
    this.jwtAuth = JWTAuthentication();
    if (process.env.NODE_ENV !== "test") {
      this.rabbitMQService = new RabbitMQService();
      this.init();
    }
  }

  private init = async () => {
    try {
      await this.rabbitMQService.connect();
      await this.rabbitMQService.createQueue("bank-accounts");
      this.rabbitMQService.consumeMessages("bank-accounts", async (message) => {
        const bankBalance = new Money(message.balance, message.currency);
        const newBankAccount = this.addBankAccount(
          message.companyId,
          message.name,
          message.department,
          message.IBAN,
          bankBalance
        );
        if (newBankAccount) {
          this.bankAccounts.push(newBankAccount);
        }
      });
    } catch (error) {
      console.log(error);
    }
  };

  verifyBearerToken = async (
    authorization: string | string[],
    refresh: string | string[]
  ): Promise<boolean> => {
    if (!authorization || !refresh) {
      return false;
    }
    if (authorization === "null" || !authorization) {
      return false;
    }
    if (!(await this.jwtAuth.verifyJWTToken(authorization))) {
      if (!(await this.jwtAuth.verifyRefreshToken(refresh))) {
        return false;
      }
    }
    return true;
  };

  getBankAccounts = () => {
    return this.bankAccounts;
  };

  getBankAccount = (IBAN: string) => {
    return this.bankAccounts.find((bank) => bank.IBAN === IBAN);
  };

  addBankAccount = (
    companyId: string,
    name: string,
    department: string,
    IBAN: string,
    balance: Money
  ) => {
    const newBankAccount = new BankAccount(
      generateUUID(),
      companyId,
      name,
      department,
      IBAN,
      balance
    );
    this.bankAccounts.push(newBankAccount);
    return newBankAccount;
  };

  transferMoney = async (
    IBANfrom: string,
    IBANto: string,
    amount: number
  ): Promise<boolean> => {
    try {
      const sender = this.getBankAccount(IBANfrom);
      const transactionMoney = new Money(amount, sender.balance.currency);
      const receiver = this.getBankAccount(IBANto);
      if (!sender || !receiver) {
        return false;
      }
      return (
        (await sender.send(transactionMoney)) &&
        (await receiver.receive(transactionMoney))
      );
    } catch (error) {
      console.log(error);
      return false;
    }
  };
}

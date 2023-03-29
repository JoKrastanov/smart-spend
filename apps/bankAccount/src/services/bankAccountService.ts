import { generateUUID } from "../helpers/generateUUID";
import { BankAccount } from "../models/bankAccount";
import { Money } from "../models/money";
import { RabbitMQService } from "./RabbitMQService";

export class BankAccountService {
  private bankAccounts: BankAccount[];
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.bankAccounts = [];
    this.rabbitMQService = new RabbitMQService();
    this.init();
  }

  private init = async () => {
    await this.rabbitMQService.connect();
    this.rabbitMQService.consumeMessages("bank-accounts", async (message) => {
      const newBankAccount = this.addBankAccount(
        message.companyId,
        message.name,
        message.department,
        message.IBAN,
        message.balance
      );
      this.bankAccounts.push(newBankAccount);
    });
  };

  getCompanies = () => {
    return this.bankAccounts;
  };

  getCompany = (IBAN: string) => {
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
}

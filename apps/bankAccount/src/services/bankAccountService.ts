import { JWTAuthentication } from "authentication-validation/lib";

import { generateUUID } from "../helpers/generateUUID";
import { BankAccount } from "../models/bankAccount";
import { Money } from "../models/money";
import { RabbitMQService } from "./RabbitMQService";
import config from "../../config";
import { BankAccountRepository } from "../repositories/bankAccountRepository";

export class BankAccountService {
  private bankAccountRepository: BankAccountRepository;
  private jwtAuth;
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.bankAccountRepository = new BankAccountRepository();
    this.jwtAuth = JWTAuthentication();
    if (
      config.server.environment !== "test" &&
      config.server.environment !== "development"
    ) {
      this.rabbitMQService = new RabbitMQService();
      this.init();
    }
  }

  private init = async () => {
    try {
      await this.rabbitMQService.connect();
      await this.rabbitMQService.createQueue("bank-accounts");
      this.rabbitMQService.consumeMessages("bank-accounts", async (message) => {
        const bankBalance = new Money(message.balance, message.currency, true);
        await this.addBankAccount(
          message.companyId,
          message.name,
          message.department,
          message.IBAN,
          bankBalance
        );
      });
    } catch (error) {
      console.log(error);
    }
  };

  verifyBearerToken = async (
    authorization: string | string[],
    refresh: string | string[]
  ): Promise<boolean> => {
    if (config.server.environment === "development") {
      return true;
    }
    if (!authorization || !refresh || authorization === "null") {
      return false;
    }
    if (!(await this.jwtAuth.verifyJWTToken(authorization))) {
      if (!(await this.jwtAuth.verifyRefreshToken(refresh))) {
        return false;
      }
    }
    return true;
  };

  getBankAccounts = async () => {
    try {
      return await this.bankAccountRepository.getAll();
    } catch (error) {
      throw error;
    }
  };

  getBankAccount = async (IBAN: string) => {
    try {
      const bankAccount = await this.bankAccountRepository.getByIBAN(IBAN);
      return bankAccount;
    } catch (error) {
      throw error;
    }
  };

  addBankAccount = async (
    companyId: string,
    name: string,
    department: string,
    IBAN: string,
    balance: Money
  ) => {
    let newBankAccount = new BankAccount(
      generateUUID(),
      companyId,
      name,
      department,
      IBAN,
      balance
    );
    newBankAccount = await this.bankAccountRepository.add(newBankAccount);
    return newBankAccount;
  };

  transferMoney = async (
    IBANfrom: string,
    IBANto: string,
    amount: number
  ): Promise<boolean> => {
    try {
      const sender = await this.getBankAccount(IBANfrom);
      const receiver = await this.getBankAccount(IBANto);
      if (!sender || !receiver) {
        return false;
      }
      const transactionMoney = new Money(amount, sender.balance.currency, true);
      const senderStatus = await sender.send(transactionMoney);
      const receiverStatus = await receiver.receive(transactionMoney);
      if (!senderStatus || !receiverStatus) {
        return false;
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  test = async () => {
    try {
      await this.bankAccountRepository.addTransaction();
    } catch (error) {
      throw error;
    }
  };
}

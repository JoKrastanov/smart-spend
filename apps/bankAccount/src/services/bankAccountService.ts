import { JWTAuthentication } from "authentication-validation/lib";

import { generateUUID } from "../helpers/generateUUID";
import { BankAccount } from "../models/bankAccount";
import { Money } from "../models/money";
import { RabbitMQService } from "./RabbitMQService";
import config from "../../config";
import { BankAccountRepository } from "../repositories/bankAccountRepository";
import { TransactionService } from "./transactionService";
import { Transaction } from "../models/transaction";

export class BankAccountService {
  private transactionService: TransactionService;
  private bankAccountRepository: BankAccountRepository;
  private jwtAuth;
  private rabbitMQService: RabbitMQService;

  constructor() {
    this.bankAccountRepository = new BankAccountRepository();
    this.transactionService = new TransactionService();
    this.jwtAuth = JWTAuthentication();
    if (config.server.environment === "test") return;
    this.rabbitMQService = new RabbitMQService();
    this.init().catch((err) => console.log("Error connecting to message broker", err));
  }

  private init = async () => {
    try {
      await this.rabbitMQService.connect();
      await this.rabbitMQService.createQueue("bank-accounts");
      await this.rabbitMQService.createQueue("delete-bankaccounts");
      await this.rabbitMQService.consumeMessages("delete-bankaccounts", async (message) => {
        await this.deleteBankAccounts(message.companyId);
      });
      await this.rabbitMQService.consumeMessages("bank-accounts", async (message) => {
        console.log("Adding new bank account", message)
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
    authorization: string,
    refresh: string
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
      console.log(error);
      throw error;
    }
  };

  getBankAccount = async (IBAN: string) => {
    try {
      const bankAccount = await this.bankAccountRepository.getByIBAN(IBAN);
      return bankAccount;
    } catch (error) {
      console.log(error);
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
    try {
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
    } catch (error) {
      return null;
    }
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
      const newTransaction = new Transaction(
        IBANfrom,
        IBANto,
        amount,
        sender.balance.currency
      );
      if (!senderStatus || !receiverStatus) {
        return false;
      }
      await this.bankAccountRepository.update(sender);
      await this.bankAccountRepository.update(receiver);
      return await this.createTransaction(newTransaction);
    } catch (error) {
      console.log(error);
      return false;
    }
  };

  userIsAdmin = async (token: string): Promise<boolean> => {
    try {
      return await this.jwtAuth.userIsAdmin(token); 
    } catch (error) {
      return false
    }
  }

  getByCompany = async (companyId: string): Promise<BankAccount[]> => {
    try {
      const bankAccountsToReturn = [];
      const bankAccounts = await this.bankAccountRepository.getByCompany(
        companyId
      );
      if (!bankAccounts) {
        return [];
      }
      bankAccounts.forEach((bankAccount: any) => {
        bankAccountsToReturn.push(
          new BankAccount(
            bankAccount.id,
            bankAccount.companyId,
            bankAccount.name,
            bankAccount.department,
            bankAccount.IBAN,
            new Money(
              bankAccount.balance.amount,
              bankAccount.balance.currency,
              false
            )
          )
        );
      });
      return bankAccountsToReturn;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  getByCompanyAndDepartment = async (companyId: string, department: string): Promise<BankAccount[]> => {
    try {
      const bankAccountsToReturn = [];
      const bankAccounts = await this.bankAccountRepository.getByCompanyAndDepartment(
        companyId,
        department
      );
      if (!bankAccounts) {
        return [];
      }
      bankAccounts.forEach((bankAccount: any) => {
        bankAccountsToReturn.push(
          new BankAccount(
            bankAccount.id,
            bankAccount.companyId,
            bankAccount.name,
            bankAccount.department,
            bankAccount.IBAN,
            new Money(
              bankAccount.balance.amount,
              bankAccount.balance.currency,
              false
            )
          )
        );
      });
      return bankAccountsToReturn;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  createTransaction = async (newTransaction: Transaction) => {
    try {
      return await this.transactionService.addTransaction(newTransaction);
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  deleteBankAccounts = async (companyId: string) => {
    try {
      await this.bankAccountRepository.deleteCompanyBankAccounts(companyId);
    } catch (error) {
      console.log(error);
    }
  };
}

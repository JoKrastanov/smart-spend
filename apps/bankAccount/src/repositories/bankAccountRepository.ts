import { BankAccount } from "../models/bankAccount";
import { Money } from "../models/money";
import { BankAccountCollection } from "../schemas/bankAccountSchema";
import { CurrencyCode } from "../types/currencies";

export class BankAccountRepository {
  private repository = BankAccountCollection;

  constructor() {
    console.log("Initializing bank repository");
  }

  getAll = async (): Promise<BankAccount[]> => {
    try {
      return (await this.repository.find()) as BankAccount[];
    } catch (error) {
      throw error;
    }
  };

  getByIBAN = async (IBAN: string): Promise<BankAccount> => {
    try {
      const fetchedBankAccount = await this.repository.findOne({
        IBAN: IBAN,
      });
      if (!fetchedBankAccount) {
        return null;
      }
      return new BankAccount(
        fetchedBankAccount.id,
        fetchedBankAccount.companyId,
        fetchedBankAccount.name,
        fetchedBankAccount.department,
        fetchedBankAccount.IBAN,
        new Money(
          fetchedBankAccount.balance.amount,
          CurrencyCode[fetchedBankAccount.balance.currency],
          false
        )
      );
    } catch (error) {
      throw error;
    }
  };

  getByCompany = async (companyId: string): Promise<Object[]> => {
    try {
      const fetchedBankAccounts = await this.repository.find({
        companyId: companyId,
      });
      return fetchedBankAccounts;
    } catch (error) {
      throw error;
    }
  };

  getByCompanyAndDepartment = async (companyId: string, department: string): Promise<Object[]> => {
    try {
      const fetchedBankAccounts = await this.repository.find({
        companyId: companyId,
        department: department
      });
      return fetchedBankAccounts;
    } catch (error) {
      throw error;
    }
  };

  add = async (bankAccount: BankAccount) => {
    try {
      const newBankAccount = new this.repository({
        id: bankAccount.id,
        companyId: bankAccount.companyId,
        name: bankAccount.name,
        department: bankAccount.department,
        IBAN: bankAccount.IBAN,
        balance: bankAccount.balance,
      });
      newBankAccount.save();
      return bankAccount;
    } catch (error) {
      throw error;
    }
  };

  update = async (bankAccount: BankAccount): Promise<BankAccount> => {
    try {
      const updateProperties = {
        id: bankAccount.id,
        companyId: bankAccount.companyId,
        name: bankAccount.name,
        department: bankAccount.department,
        IBAN: bankAccount.IBAN,
        balance: bankAccount.balance,
      };
      let bankAccountToUpdate = (await this.repository.findOneAndUpdate(
        {
          IBAN: bankAccount.IBAN,
        },
        updateProperties,
        { new: true }
      )) as BankAccount;
      if (!bankAccountToUpdate) {
        return null;
      }
      return bankAccountToUpdate;
    } catch (error) {
      throw error;
    }
  };

  deleteCompanyBankAccounts = async (companyId: string) => {
    await this.repository.deleteMany({ companyId: companyId });
  };
}

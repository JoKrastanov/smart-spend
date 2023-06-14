import { InsufficientBalanceError } from "../errors/InsufficientBalanceError";
import { getConvertedValue } from "../helpers/getConvertedValue";
import { CurrencyCode } from "../types/currencies";
import { Money } from "./money";

export class BankAccount {
  id: string;
  companyId: string;
  name: string;
  department: string;
  IBAN: string;
  balance: Money;

  constructor(
    id: string,
    companyId: string,
    name: string,
    department: string,
    IBAN: string,
    balance: Money
  ) {
    this.id = id;
    this.companyId = companyId;
    this.name = name;
    this.department = department;
    this.IBAN = IBAN;
    this.balance = balance;
  }

  checkCurrency = (currency: CurrencyCode): boolean => {
    if (currency === this.balance.currency) return true;
    return false;
  };

  checkBalance = (amount: number): boolean | InsufficientBalanceError => {
    if (this.balance.amount >= amount) return true;
    return new InsufficientBalanceError("Not enought balance");
  };

  send = async (money: Money): Promise<boolean> => {
    try {
      if (!this.checkCurrency(money.currency)) {
        const convertedMoney = await getConvertedValue(
          money.currency,
          this.balance.currency,
          money.getAmountConvertable()
        );
        if (
          !(convertedMoney instanceof Money) ||
          !this.checkBalance(money.amount)
        ) {
          return false;
        }
        this.balance.subtract(convertedMoney.amount);
        return true;
      }
      if (!this.checkBalance(money.amount)) return false;
      this.balance.subtract(money.amount);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  receive = async (money: Money): Promise<boolean> => {
    try {
      if (!this.checkCurrency(money.currency)) {
        const convertedMoney = await getConvertedValue(
          money.currency,
          this.balance.currency,
          money.getAmountConvertable()
        );
        this.balance.add(convertedMoney.amount);
        return true;
      }
      this.balance.add(money.amount);
      return true;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };
}

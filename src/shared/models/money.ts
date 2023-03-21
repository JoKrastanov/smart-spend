import { CurrencyCode } from "../types/currencies";

export class Money {
  amount: number;
  currency: CurrencyCode;

  constructor(amount: number, currency: CurrencyCode) {
    this.amount = amount * 100;
    this.currency = currency;
  }

  subtract = (amount: number) => {
    this.amount -= amount;
  };

  add = (amount: number) => {
    this.amount += amount;
  };

  getAmountConvertable = (): number => {
    return this.amount / 100;
  };

  toString = (): string => {
    return `${this.amount / 100} ${this.currency}`;
  };
}

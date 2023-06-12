import { CurrencyCode } from "../types/currencies";

export class Transaction {
  sender: string;
  receiver: string;
  amount: number;
  currency: CurrencyCode;

  constructor(
    sender: string,
    receiver: string,
    amount: number,
    currency: CurrencyCode
  ) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.currency = currency;
  }
}

import { CurrencyCode } from "../types/currencies";

export class Transaction {
  sender: String;
  receiver: String;
  amount: number;
  currency: CurrencyCode;

  constructor(
    sender: String,
    receiver: String,
    amount: number,
    currency: CurrencyCode
  ) {
    this.sender = sender;
    this.receiver = receiver;
    this.amount = amount;
    this.currency = currency;
  }
}

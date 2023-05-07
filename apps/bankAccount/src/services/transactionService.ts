import { Transaction } from "../models/transaction";
import { TransactionRepository } from "../repositories/transactionRepository";

export class TransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  addTransaction = (newTransaction: Transaction) => {
    try {
      return this.transactionRepository.addTransaction(
        newTransaction.sender,
        newTransaction.receiver,
        newTransaction.amount,
        newTransaction.currency
      );
    } catch (error) {
      throw error;
    }
  };
}

import { Transaction } from "../models/transaction";
import { TransactionRepository } from "../repositories/transactionRepository";

export class TransactionService {
  private transactionRepository: TransactionRepository;

  constructor() {
    this.transactionRepository = new TransactionRepository();
  }

  addTransaction = async (newTransaction: Transaction) => {
    try {
      return await this.transactionRepository.addTransaction(
        newTransaction.sender,
        newTransaction.receiver,
        newTransaction.amount,
        newTransaction.currency
      );
    } catch (error) {
      throw error;
    }
  };

  getTransactions = async (IBAN: string): Promise<any[]> => {
    try {
      return await this.transactionRepository.getTransactions(IBAN);
    } catch (error) {
      throw error;
    }
  };
}

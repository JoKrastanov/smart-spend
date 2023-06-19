import mysql from "mysql2";
import config from "../../config";
import { CurrencyCode } from "../types/currencies";

export class TransactionRepository {

  constructor() {
    console.log("Initializing transaction repository");
  }

  addTransaction = async (
    senderIBAN: string,
    receiverIBAN: string,
    amount: Number,
    currency: CurrencyCode
  ) => {
    try {
      const sql = `INSERT INTO bank_transactions (senderIBAN, receiverIBAN, amount, currency) 
        VALUES (${mysql.escape(senderIBAN)}, ${mysql.escape(
        receiverIBAN
      )}, ${mysql.escape(amount)}, ${mysql.escape(currency)})`;
      config.sql.connection.query(sql, (err, result) => {
        if (err) {
          console.error("Error executing query: " + err.stack);
          return;
        }
      });
      return true;
    } catch (error) {
      throw error;
    }
  };

  getTransactions = async (IBAN: string): Promise<any[]> => {
    return new Promise<any[]>((resolve, reject) => {
      try {
        const sql = `SELECT * FROM bank_transactions WHERE senderIBAN=${mysql.escape(
          IBAN
        )} OR receiverIBAN=${mysql.escape(IBAN)}
        ORDER BY(id) DESC LIMIT(100)`;

        config.sql.connection.query(sql, (err, result) => {
          if (err) {
            console.error("Error executing query: " + err.stack);
            reject(err);
            return;
          }
          const transactions = Array.isArray(result) ? result : [result];
          resolve(transactions);
        });
      } catch (error) {
        reject(error);
      }
    });
  };
}

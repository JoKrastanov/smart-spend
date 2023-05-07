import mysql from "mysql2";
import * as promise from "mysql2/promise";
import config from "../../config";
import { CurrencyCode } from "../types/currencies";

export class TransactionRepository {
  constructor() {}

  addTransaction = async (
    senderIBAN: String,
    receiverIBAN: String,
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

        console.log("Query results:", result);
      });
      return true;
    } catch (error) {
      throw error;
    }
  };
}

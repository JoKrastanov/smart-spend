import { TransactionStatus } from "../types/transactionStatuses";

export class Transaction {
  id: string;
  senderAccount: string;
  recieverAccount: string;
  utcTime: number;
  isDraft: boolean;
  status: TransactionStatus;

  constructor(
    id: string,
    senderAccount: string,
    recieverAccount: string,
    isDraft: boolean,
    status: TransactionStatus
  ) {
    this.id = id;
    this.senderAccount = senderAccount;
    this.recieverAccount = recieverAccount;
    this.utcTime = Date.now();
    this.isDraft = isDraft;
    this.status = status;
  }

  updateStatus = (newStatus: TransactionStatus) => {
    this.status = newStatus;
  }
}

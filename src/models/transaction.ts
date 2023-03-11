
export class Transaction {
  id: string;
  senderAccount: string;
  recieverAccount: string;
  utcTime: Date;
  isDraft: boolean;
  status: string;

  constructor(id: string) {
    this.id = id;
  }
}

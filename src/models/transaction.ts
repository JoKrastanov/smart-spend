import { generateUUID } from "../helpers/useUUIDHandling/generateUUID";

export class Transaction {
  id: string;
  senderAccount: string;
  recieverAccount: string;
  utcTime: Date;
  isDraft: boolean;
  status: string;

  constructor() {
    this.id = generateUUID();
  }
}

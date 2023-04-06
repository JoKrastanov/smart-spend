export type TransactionEvents =
  | {
      type: "TransactionSent";
      data: {
        senderIBAN: string;
        receiverIBAN: string;
        amount: {
          money: number;
          currency: string;
        };
      };
    }
  | {
      type: "TransactionReceived";
      data: {
        receiverIBAN: string;
        amount: {
          money: number;
          currency: string;
        };
      };
    }
  | {
      type: "TransactionRefundRequested";
      data: {
        transactionId: string;
        receiverIBAN: string;
        amount: {
          money: number;
          currency: string;
        };
      };
    };

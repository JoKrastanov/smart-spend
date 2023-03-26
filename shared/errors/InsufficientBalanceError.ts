export class InsufficientBalanceError extends Error {
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InsufficientBalanceError.prototype);
    }

    getMessage() {
        return "The transaction has been declined as the account does not have sufficient funds!"
    }
}

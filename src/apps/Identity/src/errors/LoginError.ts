export class LogInError extends Error {
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, LogInError.prototype);
    }

    getMessage() {
        return "Incorrect email or password, please try again!"
    }
}

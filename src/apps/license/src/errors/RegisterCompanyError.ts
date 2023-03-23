export class RegisterCompanyError extends Error {
    constructor(msg: string) {
        super(msg);

        // Set the prototype explicitly.
        Object.setPrototypeOf(this, RegisterCompanyError.prototype);
    }

    getMessage() {
        return "There was an error registering the company. Please try again!"
    }
}

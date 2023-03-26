export class CompanyHasLicenseError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, CompanyHasLicenseError.prototype);
  }

  getMessage() {
    return "The company already has an issued license";
  }
}

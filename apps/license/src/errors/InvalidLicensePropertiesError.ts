export class InvalidLicensePropertiesError extends Error {
  constructor(msg: string) {
    super(msg);

    // Set the prototype explicitly.
    Object.setPrototypeOf(this, InvalidLicensePropertiesError.prototype);
  }

  getMessage() {
    return "Error creating the license";
  }
}

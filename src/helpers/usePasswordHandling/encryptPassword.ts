import bcrypt from "bcrypt";

export const encryptPassword = (
  inputPassword: string
): { hash: string; salt: string } => {
  let outputHash: string;
  let outputSalt: string;
  bcrypt.genSalt(10, (err, salt) => {
    if (err) {
      return new Error(err);
    }
    bcrypt.hash(inputPassword, salt, function (err, hash) {
      if (err) {
        return new Error(err);
      }
      outputHash = hash;
      outputSalt = salt;
    });
  });
  return {
    hash: outputHash,
    salt: outputSalt,
  };
};

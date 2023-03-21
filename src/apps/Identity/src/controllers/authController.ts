import { AuthService } from "../services/authService";
import { generateUUID } from "../../../../shared/helpers/useUUIDHandling/generateUUID";
import { LogInError } from "../../../../shared/errors/LoginError";
import { UserAccount } from "../../../../shared/models/userAccount";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  logIn = async (req, res) => {
    try {
      const users = this.authService.getUsers();
      const { email, password } = req.body;

      if (users.length === 0) {
        res.status(404).json({});
      }
      const user = users.find((user) => user.email === email);
      if (!user) {
        res.status(404).json({});
      }
      const loginSuccessful = await user.login(password);
      if (!loginSuccessful) {
        res.status(401).send({ message: new LogInError("error").getMessage() });
      }

      const token = this.authService.signJWTToken(user.id, user.accountType);
      res.header("auth-token", token);
      res.status(200).json(token);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  register = async (req, res) => {
    try {
      const users = this.authService.getUsers();
      const {
        firstName,
        lastName,
        address,
        phone,
        country,
        companyId,
        email,
        password,
        department,
        accountType,
      } = req.body;

      const encryptedPassword = await this.authService.encryptPassword(password);
      if (encryptedPassword instanceof Error) {
        res.status(500).json({ message: encryptedPassword.message });
        return;
      }
      const newUser: UserAccount = new UserAccount(
        generateUUID(),
        firstName,
        lastName,
        address,
        phone,
        country,
        companyId,
        email,
        encryptedPassword.hash,
        encryptedPassword.salt,
        department,
        accountType
      );
      users.push(newUser);
      const token = this.authService.signJWTToken(
        newUser.id,
        newUser.accountType
      );
      res.status(201).json(token);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  freeMoney = async (req, res) => {
    try {
      const { authorization } = req.headers;

      if (!authorization)
        return res.status(401).send("Access Denied / Unauthorized request");
      let token = authorization.split(" ")[1]; // Remove Bearer from string
      if (token === "null" || !token)
        return res.status(401).send("Unauthorized request");
      if (!(await this.authService.verifyJWTToken(token)))
        return res.status(401).send("Unauthorized request");

      res.status(200).send("Welcome");
    } catch (error) {
      res.status(400).send("Invalid Token");
    }
  };
}

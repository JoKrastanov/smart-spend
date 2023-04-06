import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { LogInError } from "../errors/LoginError";

export class AuthController {
  private service: AuthService;

  constructor() {
    this.service = new AuthService();
  }

  logIn = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const login = await this.service.loginCheck(email, password);
      if (!login) {
        res.status(401).send({ message: new LogInError("error").getMessage() });
      }
      res.header("auth-token", login.token);
      res.header("refresh-auth-token", login.refreshToken);
      res.status(200).json(login.token);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
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
      const newUser = await this.service.addUser(
        firstName,
        lastName,
        address,
        phone,
        country,
        companyId,
        email,
        password,
        department,
        accountType
      );
      res.header("refresh-auth-token", newUser.refreshToken);
      res.header("auth-token", newUser.token);
      res.status(201).json(newUser.user);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  freeMoney = async (req: Request, res: Response) => {
    try {
      const { token, refresh } = req.headers;
      if (!token)
        return res.status(401).send("Access Denied / Unauthorized request");
      if(!await this.service.verifyBearerToken(token, refresh)) {
        return res.status(401).send("Unauthorized request");
      }
      res.status(200).send("Welcome");
    } catch (error) {
      res.status(400).send("Invalid Token");
    }
  };
}

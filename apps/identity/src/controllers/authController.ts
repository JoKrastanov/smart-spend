import { Request, Response } from "express";
import { AuthService } from "../services/authService";
import { generateUUID } from "../helpers/useUUIDHandling/generateUUID";
import { LogInError } from "../errors/LoginError";

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  logIn = async (req: Request, res: Response) => {
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
      const loginSuccessful = await this.authService.loginCheck(
        password,
        user.password
      );
      if (!loginSuccessful) {
        res.status(401).send({ message: new LogInError("error").getMessage() });
      }

      const refreshToken = this.authService.signJWTRefreshToken(
        user.id,
        user.accountType
      );
      const token = this.authService.signJWTToken(user.id, user.accountType);
      res.header("auth-token", token);
      res.header("refresh-auth-token", refreshToken);
      res.status(200).json(token);
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

      const newUser = await this.authService.addUser(
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

      const token = this.authService.signJWTToken(
        newUser.id,
        newUser.accountType
      );
      const refreshToken = this.authService.signJWTRefreshToken(
        newUser.id,
        newUser.accountType
      );
      res.header("refresh-auth-token", refreshToken);
      res.header("auth-token", token);

      res.status(201).json(token);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  freeMoney = async (req: Request, res: Response) => {
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

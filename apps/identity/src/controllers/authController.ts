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
      res.status(200).json({
        token: login.token,
        refresh: login.refreshToken,
        userId: login.user.id,
      });
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
      res.status(201).json({
        token: newUser.token,
        refresh: newUser.refreshToken,
        userId: newUser.user.id,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

  freeMoney = async (req: Request, res: Response) => {
    try {
      const { token, refresh } = req.headers as { token: string, refresh: string };
      if (!token)
        return res.status(401).send("Access Denied / Unauthorized request");
      if (!(await this.service.verifyBearerToken(token as string, refresh as string))) {
        return res.status(401).send("Unauthorized request");
      }
      res.status(200).send("Welcome");
    } catch (error) {
      res.status(400).send("Invalid Token");
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const { token, refresh } = req.headers as { token: string, refresh: string };
      if (!token)
        return res.status(401).send("Access Denied / Unauthorized request");
      if (!(await this.service.verifyBearerToken(token as string, refresh as string))) {
        return res.status(401).send("Unauthorized request");
      }
      const { userId } = req.params;
      const user = await this.service.getUser(userId);
      if (!user) {
        res.status(404).send({ message: "User not found" });
      }
      res.status(200).send(user);
    } catch (error) {
      console.log(error);
      res.status(400).send("Error fetching user data");
    }
  };
}

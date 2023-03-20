import { Router } from "express";
import { encryptPassword } from "../helpers/usePasswordHandling/encryptPassword";
import { generateUUID } from "../helpers/useUUIDHandling/generateUUID";
import { UserAccount } from "../models/userAccount";
import { LogInError } from "../errors/LoginError";
import { signJWTToken } from "../helpers/useAuth/signJWTToken";
import { verifyJWTToken } from "../helpers/useAuth/verifyJWTToken";

export const authRouter = Router();
const users: UserAccount[] = [];

authRouter.post("/login", async (req, res) => {
  try {
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

    const token = signJWTToken(user.id, user.accountType);
    res.header("auth-token", token);
    res.status(200).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

authRouter.post("/register", async (req, res) => {
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

    const encryptedPassword = await encryptPassword(password);
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
    const token = signJWTToken(newUser.id, newUser.accountType);
    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

authRouter.get("/money", (req, res) => {
  try {
    const { authorization } = req.headers;

    if (!authorization)
      return res.status(401).send("Access Denied / Unauthorized request");
    let token = authorization.split(" ")[1]; // Remove Bearer from string
    if (token === "null" || !token)
      return res.status(401).send("Unauthorized request");
    if (!verifyJWTToken(token))
      return res.status(401).send("Unauthorized request");

    res.status(200).send("Welcome");
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
});

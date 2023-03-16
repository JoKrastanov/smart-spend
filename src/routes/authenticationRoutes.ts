import { Router } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { encryptPassword } from "../helpers/usePasswordHandling/encryptPassword";
import { generateUUID } from "../helpers/useUUIDHandling/generateUUID";
import { UserAccount } from "../models/userAccount";
import { LogInError } from "../errors/LoginError";

dotenv.config();
export const authRouter = Router();

const users: UserAccount[] = [];

authRouter.post("/login", async (req, res) => {
  try {
    users.forEach(async (user) => {
      if (user.email !== req.body.email) return;
      const validPassword = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!validPassword)
        return res
          .status(401)
          .send({ message: new LogInError("error").getMessage() });
      // Create and assign token
      const payload = { id: user.id, user_type: user.accountType };
      const token = jwt.sign(payload, process.env.JWT_SECRET);

      res.status(200).json({ token: token }).header("auth-token", token);
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

authRouter.post("/register", async (req, res) => {
  try {
    const encryptedPassword = await encryptPassword(req.body.password);
    if (encryptedPassword instanceof Error) {
      res.status(500).json({ message: encryptedPassword.message });
      return;
    }
    const newUser: UserAccount = new UserAccount(
      generateUUID(),
      req.body.firstName,
      req.body.lastName,
      req.body.address,
      req.body.phone,
      req.body.country,
      req.body.companyId,
      req.body.email,
      encryptedPassword.hash,
      encryptedPassword.salt,
      req.body.department,
      req.body.accountType
    );
    users.push(newUser);
    const payload = { id: newUser.id, user_type: newUser.accountType };
    const token = jwt.sign(payload, process.env.JWT_SECRET);
    res.status(201).json(token);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

authRouter.get("/money", (req, res) => {
  let token = req.headers.authorization;
  if (!token)
    return res.status(401).send("Access Denied / Unauthorized request");

  try {
    token = token.split(" ")[1]; // Remove Bearer from string

    if (token === "null" || !token)
      return res.status(401).send("Unauthorized request");

    let verifiedUser = jwt.verify(token, process.env.JWT_SECRET);
    if (!verifiedUser) return res.status(401).send("Unauthorized request");

    res.status(200).send("Welcome");
  } catch (error) {
    res.status(400).send("Invalid Token");
  }
});

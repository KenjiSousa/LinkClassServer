import { LoginRequest } from "#interfaces/authInterfaces.js";
import express from "express";
import * as LoginService from "#service/loginService.js";
import jwt from "jsonwebtoken";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ?? "";

router.post("", async (req: LoginRequest, res) => {
  const { idToken, deviceId } = req.body;

  const payload = await LoginService.login(idToken, deviceId);
  payload.exp = payload.iat + 60 * 30; // válido por 30min
  const token = jwt.sign(payload, JWT_SECRET, {});

  return res.json({ token });
});

export default router;

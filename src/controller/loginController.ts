import { LoginRequest } from "#interfaces/authInterfaces.js";
import express from "express";
import * as LoginService from "#service/loginService.js";
import jwt from "jsonwebtoken";
import { authenticateJWT } from "#auth/authenticateJWT.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET ?? "";

router.post("", async (req: LoginRequest, res) => {
  const { idToken, deviceId } = req.body;

  const payload = await LoginService.login(idToken, deviceId);
  const token = jwt.sign(payload, JWT_SECRET, {});

  // mobile
  if (deviceId) {
  return res.json({ token });
  }

  // web
  res
    .cookie("token", token, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
    })
    .send();
});

router.get("/validate", authenticateJWT, (_req, res) => {
  console.log("cookies: " + JSON.stringify(_req.cookies));
  res.status(200).send();
});

export default router;

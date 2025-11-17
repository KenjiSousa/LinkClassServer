import express from "express";
import * as UsuarioService from "#service/usuarioService.js";
import { SetRaRequest } from "#interfaces/usuarioInterfaces.js";

const router = express.Router();

router.post("/setRa", async (req: SetRaRequest, res) => {
  const { ra } = req.body;

  await UsuarioService.setRa(req.usuario!.email, ra);

  return res.status(200).send();
});

export default router;

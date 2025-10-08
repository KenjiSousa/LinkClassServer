import express from "express";
import * as PresencaService from "#service/presencaService.js";
import { PresencaDTO } from "#dto/presencaDTO.js";
import { PresencaSelectRequest } from "#interfaces/presencaInterfaces.js";

const router = express.Router();

router.get("", async (req: PresencaSelectRequest, res) => {
  if (req.usuario!.papel !== "admin") {
    req.query.email_usuario = req.usuario!.email;
  }

  return res.json(await PresencaService.consultaPresencas(req.query));
});

router.get("/:id", async (req, res) => {
  let emailUsuario: string | undefined;

  if (req.usuario!.papel !== "admin") {
    emailUsuario = req.usuario!.email;
  }

  const { id } = req.params;

  const presenca = await PresencaService.getPresencaByIdAndUserEmail(
    Number(id),
    emailUsuario,
  );

  if (!presenca)
    return res.status(404).json({ message: "Presença não encontrada" });

  return res.json(new PresencaDTO(presenca));
});

export default router;

import express from "express";
import * as PresencaService from "#service/presencaService.js";
import { PresencaDTO } from "#dto/presencaDTO.js";
import { PresencaSelectRequest } from "#interfaces/presencaInterfaces.js";
import { Presenca } from "#model/presenca.js";

const router = express.Router();

router.get("", async (req: PresencaSelectRequest, res) => {
  return res.json(
    await PresencaService.consultaPresencas(req.query, req.usuario),
  );
});

router.get("/:id", async (req, res) => {
  let emailUsuario: string | undefined;

  const { id } = req.params;

  let presenca: Presenca | undefined;

  if (req.usuario!.papel !== "admin") {
    emailUsuario = req.usuario!.email;

    presenca = await PresencaService.getPresencaByIdAndUserEmail(
      Number(id),
      emailUsuario,
    );
  } else {
    presenca = await PresencaService.getPresencaById(Number(id));
  }

  return res.json(new PresencaDTO(presenca));
});

export default router;

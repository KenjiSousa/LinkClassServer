import express, { Response } from "express";
import { createHash } from "crypto";
import { HashStore } from "#store/hashStore.js";
import { ApiError } from "#error/apiError.js";
import * as UsuarioService from "#service/usuarioService.js";
import * as EventoService from "#service/eventoService.js";
import * as PresencaRepo from "#repository/presencaRepo.js";
import { Presenca } from "#model/presenca.js";
import {
  PresencaLinkGenerateRequest,
  PresencaLinkVerifyRequest,
} from "#interfaces/presencaInterfaces.js";

const router = express.Router();

const SECRET_SALT = process.env.SECRET_SALT || "default-salt";
const TTL_SECONDS = Number(process.env.HASH_TTL_SECONDS) || 10;

router.get(
  "/generate",
  async (req: PresencaLinkGenerateRequest, res: Response) => {
    const { id_evento } = req.query;

    if (!id_evento) {
      return res.status(400).json({ message: "ID do evento é obrigatório" });
    }

    await EventoService.getEventoById(id_evento); // Verifica se o evento existe

    const timestamp = Math.floor(Date.now() / 1000); // Timestamp atual em segundos
    const data = `${id_evento}:${timestamp}:${SECRET_SALT}`;
    const hash = createHash("sha256").update(data).digest("hex");

    HashStore.getInstance().add(hash, id_evento, TTL_SECONDS);

    return res.json({ hash });
  },
);

router.get("/verify", async (req: PresencaLinkVerifyRequest, res) => {
  const { hash } = req.query;

  if (!hash) {
    throw new ApiError(400, "Hash é obrigatório");
  }

  const hashStore = HashStore.getInstance();

  if (!hashStore.has(hash)) {
    throw new ApiError(410, "Código expirado, tente novamente.");
  }

  const usuario = await UsuarioService.getUsuarioByEmail(req.usuario!.email);
  const eventoId = hashStore.get(hash)!.eventoId;
  const evento = await EventoService.getEventoById(eventoId);
  const presenca = new Presenca(usuario, evento);

  try {
    await PresencaRepo.inserePresenca(presenca);
  } catch (err: any) {
    if (err.code === "ER_DUP_ENTRY") {
      throw new ApiError(
        409,
        `Já existe um registro de presença para o usuário de e-mail ${req.usuario!.email} e evento ${eventoId}`,
      );
    }

    throw err;
  }

  return res.status(200).send();
});

export default router;

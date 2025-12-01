import express from "express";
import * as EventoService from "#service/eventoService.js";
import { EventoDTO } from "#dto/eventoDTO.js";
import adminOnly from "#auth/adminOnly.js";
import {
  EventoDeleteRequest,
  EventoInsertRequest,
  EventoSelectRequest,
  EventoUpdateRequest,
} from "#interfaces/eventoInterfaces.js";

const router = express.Router();

router.post("", adminOnly, async (req: EventoInsertRequest, res) => {
  const evento = await EventoService.insereEvento(req.body);

  return res.json(new EventoDTO(evento));
});

router.get("", async (req: EventoSelectRequest, res) => {
  return res.json(await EventoService.consultaEventos(req.query));
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const evento = await EventoService.getEventoById(Number(id));

  return res.json(new EventoDTO(evento));
});

router.put("/:id", adminOnly, async (req: EventoUpdateRequest, res) => {
  const { id } = req.params;

  await EventoService.updateEvento(Number(id), req.body);

  return res.status(200).send();
});

router.delete("/:id", adminOnly, async (req: EventoDeleteRequest, res) => {
  const { id } = req.params;

  await EventoService.deleteEvento(Number(id));

  return res.status(200).send();
});

export default router;

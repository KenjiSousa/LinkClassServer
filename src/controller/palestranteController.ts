import express from "express";
import * as PalestranteService from "#service/palestranteService.js";
import adminOnly from "#auth/adminOnly.js";
import {
  PalestranteInsertRequest,
  PalestranteSelectRequest,
  PalestranteUpdateRequest,
} from "#interfaces/palestranteInterfaces.js";
import { PalestranteDTO } from "#dto/palestranteDTO.js";

const router = express.Router();

router.post("", adminOnly, async (req: PalestranteInsertRequest, res) => {
  const palestrante = await PalestranteService.inserePalestrante(req.body);

  return res.json(new PalestranteDTO(palestrante));
});

router.get("", async (req: PalestranteSelectRequest, res) => {
  return res.json(await PalestranteService.consultaPalestrantes(req.query));
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const palestrante = await PalestranteService.getPalestranteById(Number(id));

  return res.json(new PalestranteDTO(palestrante));
});

router.put("/:id", adminOnly, async (req: PalestranteUpdateRequest, res) => {
  const { id } = req.params;

  await PalestranteService.updatePalestrantes(Number(id), req.body);

  return res.status(200).send();
});

export default router;

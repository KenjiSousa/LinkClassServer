import { ApiError } from "#error/apiError.js";
import { Palestrante } from "#model/palestrante.js";
import * as PalestranteRepo from "#repository/palestranteRepo.js";
import { assertNotEmpty, validaCampos } from "#util/assertion.js";
import { PalestranteDTO } from "#dto/palestranteDTO.js";
import {
  PalestranteInsertRequestBody,
  PalestranteSelectRequestQuery,
  PalestranteUpdateRequestBody,
} from "#interfaces/palestranteInterfaces.js";
import { CamposErro } from "#interfaces/errorInterfaces.js";

export async function inserePalestrante(
  body: PalestranteInsertRequestBody,
): Promise<Palestrante> {
  const { nome, descricao } = body;

  {
    const campos: CamposErro = {};

    assertNotEmpty(nome, campos, "nome", "Nome é obrigatório");

    validaCampos(campos);
  }

  const palestrante = new Palestrante(nome!, descricao);

  await PalestranteRepo.inserePalestrantes(palestrante);

  return palestrante;
}

export async function getPalestranteById(id: number): Promise<Palestrante> {
  const palestrante = await PalestranteRepo.getPalestranteById(id);

  if (!palestrante)
    throw new ApiError(404, `Palestrante de id ${id} não encontrado`);

  return palestrante;
}

export async function getPalestrantesByIds(
  ids: number[],
): Promise<Palestrante[]> {
  const palestrantes: Palestrante[] =
    await PalestranteRepo.getPalestrantesByIds(ids);

  return palestrantes;
}

export async function consultaPalestrantes(
  query: PalestranteSelectRequestQuery,
): Promise<PalestranteDTO[]> {
  const { nome, descricao } = query;

  const palestrantes = await PalestranteRepo.consultaPalestrantes(
    nome,
    descricao,
  );

  let palestrantesDto: PalestranteDTO[] = palestrantes.map(
    (palestrante) => new PalestranteDTO(palestrante),
  );

  return palestrantesDto;
}

export async function updatePalestrantes(
  id: number,
  body: PalestranteUpdateRequestBody,
) {
  const { nome, descricao } = body;

  const palestranteOld = await getPalestranteById(id);

  const palestranteNew = structuredClone(palestranteOld);

  {
    const campos: CamposErro = {};

    palestranteNew.nome = nome ?? palestranteOld.nome;
    assertNotEmpty(
      palestranteNew.nome,
      campos,
      "nome",
      "Nome não deve estar vazio",
    );

    validaCampos(campos);
  }

  palestranteNew.descricao = descricao ?? palestranteOld.descricao;

  return await PalestranteRepo.updatePalestrante(palestranteNew);
}

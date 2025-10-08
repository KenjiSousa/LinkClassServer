import { ApiError } from "#error/apiError.js";
import { Presenca } from "#model/presenca.js";
import * as PresencaRepo from "#repository/presencaRepo.js";
import { assertNotEmpty, validaCampos } from "#util/assertion.js";
import { PresencaDTO } from "#dto/presencaDTO.js";
import { getEventoById } from "#service/eventoService.js";
import { getUsuarioByEmail } from "#service/usuarioService.js";
import {
  PresencaInsertRequestBody,
  PresencaSelectRequestQuery,
} from "#interfaces/presencaInterfaces.js";
import { CamposErro } from "#interfaces/errorInterfaces.js";

export const inserePresenca = async (
  body: PresencaInsertRequestBody,
): Promise<Presenca> => {
  const { email_usuario, id_evento } = body;

  {
    const campos: CamposErro = {};

    assertNotEmpty(
      email_usuario,
      campos,
      "email_usuario",
      "ID do usuário é obrigatório",
    );
    assertNotEmpty(
      id_evento,
      campos,
      "id_evento",
      "ID do evento é obrigatório",
    );

    validaCampos(campos);
  }

  const usuario = await getUsuarioByEmail(email_usuario!);
  if (!usuario)
    throw new ApiError(
      404,
      `Usuário de e-mail ${email_usuario} não encontrado`,
    );

  const evento = await getEventoById(id_evento!);
  if (!evento)
    throw new ApiError(404, `Evento de id ${id_evento} não encontrado`);

  const presenca = new Presenca(usuario, evento);

  await PresencaRepo.inserePresenca(presenca);

  return presenca;
};

export const getPresencaByIdAndUserEmail = async (
  id: number,
  userEmail?: string,
): Promise<Presenca | null> => {
  return await PresencaRepo.getPresencaByIdAndUserEmail(id, userEmail);
};

export const consultaPresencas = async (
  query: PresencaSelectRequestQuery,
): Promise<PresencaDTO[]> => {
  const { email_usuario, id_evento, nome_evento } = query;

  const presencas = await PresencaRepo.consultaPresencas(
    email_usuario,
    id_evento,
    nome_evento,
  );

  const presencasDto: PresencaDTO[] = [];

  for (const presenca of presencas) {
    presencasDto.push(new PresencaDTO(presenca));
  }

  return presencasDto;
};

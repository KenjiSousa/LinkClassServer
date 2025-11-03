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
import { UsuarioDTO } from "#dto/usuarioDTO.js";

export async function inserePresenca(
  body: PresencaInsertRequestBody,
): Promise<Presenca> {
  const { email_usuario, id_evento } = body;

  {
    const campos: CamposErro = {};

    assertNotEmpty(
      email_usuario,
      campos,
      "email_usuario",
      "E-mail do usuário é obrigatório",
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
  const evento = await getEventoById(id_evento!);
  const presenca = new Presenca(usuario, evento);

  await PresencaRepo.inserePresenca(presenca);

  return presenca;
}

export async function getPresencaByIdAndUserEmail(
  id: number,
  userEmail?: string,
): Promise<Presenca> {
  const presenca = await PresencaRepo.getPresencaByIdAndUserEmail(
    id,
    userEmail,
  );

  if (!presenca) {
    throw new ApiError(
      404,
      `Presença de id ${id} e e-mail ${userEmail} não encontrada`,
    );
  }

  return presenca;
}

export async function getPresencaById(id: number): Promise<Presenca> {
  const presenca = await PresencaRepo.getPresencaById(id);

  if (!presenca) {
    throw new ApiError(404, `Presença de id ${id} não encontrada`);
  }

  return presenca;
}

export async function consultaPresencas(
  query: PresencaSelectRequestQuery,
  usuario_sessao?: UsuarioDTO,
): Promise<PresencaDTO[]> {
  const { id_evento, nome_evento } = query;
  const email_usuario: string | undefined =
    (usuario_sessao?.papel === "aluno" ? usuario_sessao.email : undefined) ||
    query.email_usuario;

  const presencas = await PresencaRepo.consultaPresencas(
    email_usuario,
    id_evento,
    nome_evento,
  );

  const presencasDto: PresencaDTO[] = presencas.map(
    (presenca) => new PresencaDTO(presenca),
  );

  return presencasDto;
}

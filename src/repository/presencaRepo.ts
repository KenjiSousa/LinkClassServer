import { PresencaDB } from "#dbTypes/presencaDB.js";
import { execute } from "#util/dbUtils.js";
import { Presenca } from "#model/presenca.js";
import { ApiError } from "#error/apiError.js";
import { getUsuarioByEmail } from "#service/usuarioService.js";
import { getEventoById } from "#service/eventoService.js";
import { InsertResult } from "#interfaces/dbInterfaces.js";

const SCHEMA = process.env.DB_SCHEMA;

const constructPresenca = async (
  rows: PresencaDB[],
): Promise<Presenca | null> => {
  if (!rows || rows.length === 0) return null;

  const usuario = await getUsuarioByEmail(rows[0].email_usuario);
  if (!usuario)
    throw new ApiError(
      400,
      `Usuário de id ${rows[0].email_usuario} não encontrado`,
    );

  const evento = await getEventoById(rows[0].id_evento);
  if (!evento)
    throw new ApiError(400, `Evento de id ${rows[0].id_evento} não encontrado`);

  const presenca = new Presenca(usuario, evento);
  presenca.id = rows[0].id;

  return presenca;
};

const constructPresencaList = async (
  rows: PresencaDB[],
): Promise<Presenca[]> => {
  if (!rows || rows.length === 0) return [];

  const presencas: Presenca[] = [];

  for (const row of rows) {
    const usuario = await getUsuarioByEmail(row.email_usuario);
    if (!usuario)
      throw new ApiError(
        400,
        `Usuário de id ${row.email_usuario} não encontrado`,
      );

    const evento = await getEventoById(row.id_evento);
    if (!evento)
      throw new ApiError(400, `Evento de id ${row.id_evento} não encontrado`);

    const presenca = new Presenca(usuario, evento);
    presenca.id = row.id;

    presencas.push(presenca);
  }

  return presencas;
};

export const inserePresenca = async (presenca: Presenca) => {
  const result = await execute<InsertResult>(
    `insert into ${SCHEMA}.presenca(id, id_usuario, id_evento)` +
      ` values (?, ?, ?)`,
    [presenca.id, presenca.usuario.email, presenca.evento.id],
  );

  presenca.id = result.insertId;
};

export const getPresencaByIdAndUserEmail = async (
  id: number,
  email?: string,
) => {
  let filtro = "";
  const values: any[] = [id];

  if (email) {
    filtro = " and email_usuario = ?";
    values.push(email);
  }

  return await constructPresenca(
    await execute<PresencaDB[]>(
      `select * from ${SCHEMA}.presenca where id = ?${filtro}`,
      values,
    ),
  );
};

export const consultaPresencas = async (
  email_usuario?: string,
  id_evento?: number,
  nome_evento?: string,
): Promise<Presenca[]> => {
  let filtro = "";
  const values: any[] = [];

  const concatFiltro = (valor: any, condicao: string) => {
    if (valor) {
      filtro += (filtro ? " and " : " where ") + condicao;
      values.push(valor);
    }
  };

  concatFiltro(email_usuario, "p.email_usuario = ?");
  concatFiltro(id_evento, "p.id_evento = ?");
  concatFiltro(nome_evento, "upper(e.nome) like concat('%', upper(?), '%')");

  const result = await execute<PresencaDB[]>(
    `select p.* from ${SCHEMA}.presenca p` +
      ` join ${SCHEMA}.usuario u on p.email_usuario = u.email` +
      ` join ${SCHEMA}.evento e on p.id_evento = e.id` +
      filtro,
    values,
  );

  return await constructPresencaList(result);
};

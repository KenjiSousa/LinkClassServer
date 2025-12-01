import { PresencaDB } from "#dbTypes/presencaDB.js";
import { execute } from "#util/dbUtils.js";
import { Presenca } from "#model/presenca.js";
import * as UsuarioService from "#service/usuarioService.js";
import * as EventoService from "#service/eventoService.js";
import { InsertResult } from "#interfaces/dbInterfaces.js";

const SCHEMA: string = process.env.DB_SCHEMA ?? "linkclass";

async function constructPresenca(rows: PresencaDB[]): Promise<Presenca | null> {
  if (!rows || rows.length === 0) return null;

  const usuario = await UsuarioService.getUsuarioByEmail(rows[0].email_usuario);

  const evento = await EventoService.getEventoById(rows[0].id_evento);

  const presenca = new Presenca(usuario, evento, rows[0].dt_record);
  presenca.id = rows[0].id;

  return presenca;
}

async function constructPresencaList(rows: PresencaDB[]): Promise<Presenca[]> {
  if (!rows || rows.length === 0) return [];

  const presencas: Presenca[] = await Promise.all(
    rows.map(async (row) => (await constructPresenca([row]))!),
  );

  return presencas;
}

export async function inserePresenca(presenca: Presenca): Promise<void> {
  const result = await execute<InsertResult>(
    `insert into ${SCHEMA}.presenca(email_usuario, id_evento)` +
      ` values (?, ?)`,
    [presenca.usuario.email, presenca.evento.id!],
  );

  presenca.id = result.insertId;
}

export async function getPresencaByIdAndUserEmail(
  id: number,
  email?: string,
): Promise<Presenca | null> {
  let filtro: string = "";
  const values: (number | string)[] = [id];

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
}

export async function getPresencaById(id: number): Promise<Presenca | null> {
  let filtro: string = "";

  return await constructPresenca(
    await execute<PresencaDB[]>(
      `select * from ${SCHEMA}.presenca where id = ?${filtro}`,
      [id],
    ),
  );
}

export async function consultaPresencas(
  email_usuario?: string,
  id_evento?: number,
  nome_evento?: string,
): Promise<Presenca[]> {
  let filtro = "";
  const values: (number | string)[] = [];

  function concatFiltro(
    valor: number | string | undefined,
    condicao: string,
  ): void {
    if (valor) {
      filtro += (filtro ? " and " : " where ") + condicao;
      values.push(valor);
    }
  }

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
}

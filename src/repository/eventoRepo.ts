import { EventoDB } from "#dbTypes/eventoDB.js";
import {
  Connection,
  dateToString,
  execute,
  getConnection,
} from "#util/dbUtils.js";
import { Evento } from "#model/evento.js";
import { EventoStatus } from "#dbTypes/eventoStatus.js";
import { InsertResult } from "#interfaces/dbInterfaces.js";
import * as EventoPalestranteRepo from "#repository/eventoPalestranteRepo.js";
import { Palestrante } from "#model/palestrante.js";

const SCHEMA = process.env.DB_SCHEMA;

async function constructEvento(rows: EventoDB[]): Promise<Evento | null> {
  if (!rows || rows.length === 0) return null;

  const evento = new Evento(
    rows[0].nome!,
    rows[0].data!,
    rows[0].hr_ini!,
    rows[0].hr_fim!,
    rows[0].logradouro!,
    rows[0].numero,
    await EventoPalestranteRepo.getPalestrantesByIdEvento(rows[0]["id"]!),
    rows[0].tema!,
    rows[0].status!,
    rows[0].obs!,
  );

  evento.id = rows[0]["id"];

  return evento;
}

async function constructEventoList(rows: EventoDB[]): Promise<Evento[]> {
  if (!rows || rows.length === 0) return [];

  const eventos: Evento[] = await Promise.all(
    rows.map(async (row) => (await constructEvento([row]))!),
  );

  return eventos;
}

export const insereEvento = async (evento: Evento) => {
  const conn: Connection = await getConnection();

  await conn.beginTransaction();

  try {
    const result = await conn.execute<InsertResult>(
      `insert into ${SCHEMA}.evento(` +
        `nome, data, hr_ini, hr_fim, logradouro, numero, tema, status, obs)` +
        ` values (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        evento.nome,
        dateToString(evento.data!),
        evento.hrIni,
        evento.hrFim,
        evento.logradouro,
        evento.numero ?? null,
        evento.tema,
        evento.status,
        evento.obs ?? null,
      ],
    );

    evento.id = result.insertId;

    const idsPalestrantes: number[] = evento.palestrantes.map(
      (palestrante) => palestrante.id!,
    );

    await EventoPalestranteRepo.insertEventoPalestrante(
      conn,
      evento.id!,
      idsPalestrantes,
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.close();
  }
};

export const getEventoById = async (id: number) => {
  return await constructEvento(
    await execute<EventoDB[]>(`select * from ${SCHEMA}.evento where id = ?`, [
      id,
    ]),
  );
};

export const consultaEventos = async (
  nome?: string,
  data_ini?: string,
  data_fim?: string,
  logradouro?: string,
  numero?: string,
  palestrante?: string,
  tema?: string,
  status?: EventoStatus,
  obs?: string,
): Promise<Evento[]> => {
  let filtro: string = "";
  const values: any[] = [];

  function concatFiltro(valor: string | undefined, condicao: string): void {
    if (valor) {
      filtro += (filtro ? " and " : " where ") + condicao;
      values.push(valor);
    }
  }

  concatFiltro(
    palestrante,
    `exists (select 1 from ${SCHEMA}.evento_palestrante ep` +
      ` join ${SCHEMA}.palestrante p on ep.id_palestrante = p.id` +
      ` where e.id = ep.id_evento` +
      ` and upper(p.nome) like concat('%', upper(?), '%'))`,
  );
  concatFiltro(nome, "upper(e.nome) like concat('%', upper(?), '%')");
  concatFiltro(data_ini, "e.data >= ?");
  concatFiltro(data_fim, "e.data <= ?");
  concatFiltro(
    logradouro,
    "upper(e.logradouro) like concat('%', upper(?), '%')",
  );
  concatFiltro(numero, "upper(e.numero) like concat('%', upper(?), '%')");
  concatFiltro(tema, "e.tema like concat('%', upper(?), '%')");
  concatFiltro(status, "e.status = ?");
  concatFiltro(obs, "upper(e.obs) like concat('%', upper(?), '%')");

  const result = await execute<EventoDB[]>(
    `select e.* from ${SCHEMA}.evento e${filtro}`,
    values,
  );

  return constructEventoList(result);
};

export const updateEvento = async (
  evento: Evento,
  palestrantesIdsNew: number[],
) => {
  const conn = await getConnection();

  await conn.beginTransaction();

  try {
    await conn.execute(
      `update ${SCHEMA}.evento` +
        ` set nome = ?,` +
        ` data = ?,` +
        ` hr_ini = ?,` +
        ` hr_fim = ?,` +
        ` logradouro = ?,` +
        ` numero = ?,` +
        ` tema = ?,` +
        ` status = ?,` +
        ` obs = ?` +
        ` where id = ?`,
      [
        evento.nome,
        dateToString(evento.data),
        evento.hrIni,
        evento.hrFim,
        evento.logradouro,
        evento.numero ?? null,
        evento.tema,
        evento.status,
        evento.obs ?? null,
        evento.id ?? null,
      ],
    );

    const palestrantesIdsOld: number[] = (
      await EventoPalestranteRepo.getPalestrantesByIdEvento(evento.id!)
    ).map((palestrante) => palestrante.id!);

    await EventoPalestranteRepo.deleteEventoPalestrante(
      conn,
      evento.id!,
      palestrantesIdsOld.filter((id) => !palestrantesIdsNew.includes(id)),
    );
    await EventoPalestranteRepo.insertEventoPalestrante(
      conn,
      evento.id!,
      palestrantesIdsNew.filter((id) => !palestrantesIdsOld.includes(id)),
    );

    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.close();
  }
};

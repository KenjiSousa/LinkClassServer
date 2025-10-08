import { EventoDB } from "#dbTypes/eventoDB.js";
import { dateToString, execute } from "#util/dbUtils.js";
import { Evento } from "#model/evento.js";
import { EventoStatus } from "#dbTypes/eventoStatus.js";
import { InsertResult } from "#interfaces/dbInterfaces.js";

const SCHEMA = process.env.DB_SCHEMA;

const constructEvento = (rows: EventoDB[]): Evento | null => {
  if (!rows || rows.length === 0) return null;

  const evento = new Evento(
    rows[0].nome!,
    rows[0].data!,
    rows[0].hr_ini!,
    rows[0].hr_fim!,
    rows[0].logradouro!,
    rows[0].numero,
    rows[0].orador!,
    rows[0].tema!,
    rows[0].status!,
    rows[0].obs!,
  );

  evento.id = rows[0]["id"];

  return evento;
};

const constructEventoList = (rows: EventoDB[]): Evento[] => {
  if (!rows || rows.length === 0) return [];

  const eventos: Evento[] = [];

  for (const row of rows) {
    const evento = new Evento(
      row.nome!,
      row.data!,
      row.hr_ini!,
      row.hr_fim!,
      rows[0].logradouro!,
      rows[0].numero,
      rows[0].orador!,
      rows[0].tema!,
      row.status!,
      row.obs,
    );

    evento.id = row.id;

    eventos.push(evento);
  }

  return eventos;
};

export const insereEvento = async (evento: Evento) => {
  const result = await execute<InsertResult>(
    `insert into ${SCHEMA}.evento(` +
      `id, nome, data, hr_ini, hr_fim, logradouro, numero, orador, tema,` +
      `status, obs)` +
      ` values (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      evento.id,
      evento.nome,
      dateToString(evento.data!),
      evento.hrIni,
      evento.hrFim,
      evento.logradouro,
      evento.numero,
      evento.orador,
      evento.tema,
      evento.status,
      evento.obs,
    ],
  );

  evento.id = result.insertId;
};

export const getEventoById = async (id: number) => {
  return constructEvento(
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
  orador?: string,
  tema?: string,
  status?: EventoStatus,
  obs?: string,
): Promise<Evento[]> => {
  let filtro = "";
  const values: any[] = [];

  function concatFiltro(valor: any, condicao: string) {
    if (valor) {
      filtro += (filtro ? " and " : " where ") + condicao;
      values.push(valor);
    }
  }

  concatFiltro(nome, "upper(nome) like concat('%', upper(?), '%')");
  concatFiltro(data_ini, "data >= ?");
  concatFiltro(data_fim, "data <= ?");
  concatFiltro(logradouro, "logradouro like concat('%', upper(?), '%')");
  concatFiltro(numero, "numero like concat('%', upper(?), '%')");
  concatFiltro(orador, "orador like concat('%', upper(?), '%')");
  concatFiltro(tema, "tema like concat('%', upper(?), '%')");
  concatFiltro(status, "status = ?");
  concatFiltro(obs, "upper(obs) like concat('%', upper(?), '%')");

  const result = await execute<EventoDB[]>(
    `select * from ${SCHEMA}.evento${filtro}`,
    values,
  );

  return constructEventoList(result);
};

export const updateEvento = async (evento: Evento) => {
  await execute(
    `update ${SCHEMA}.evento` +
      ` set nome = ?,` +
      ` data = ?,` +
      ` hr_ini = ?,` +
      ` hr_fim = ?,` +
      ` logradouro = ?,` +
      ` numero = ?,` +
      ` orador = ?,` +
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
      evento.numero,
      evento.orador,
      evento.tema,
      evento.status,
      evento.obs,
      evento.id,
    ],
  );
};

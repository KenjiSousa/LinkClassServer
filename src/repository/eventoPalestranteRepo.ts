import { PalestranteDB } from "#dbTypes/palestranteDB.js";
import { Palestrante } from "#model/palestrante.js";
import { Connection, execute } from "#util/dbUtils.js";
import { constructPalestranteList } from "./palestranteRepo.js";

const SCHEMA = process.env.DB_SCHEMA;

export async function insertEventoPalestrante(
  conn: Connection,
  idEvento: number,
  idsPalestrantes: number[],
): Promise<void> {
  const values = idsPalestrantes.map(() => "(?, ?)").join(", ");

  await conn.execute(
    `insert into ${SCHEMA}.evento_palestrante (id_evento, id_palestrante) values ${values}`,
    idsPalestrantes.flatMap((idPalestrante) => [idEvento, idPalestrante]),
  );
}

export async function deleteEventoPalestrante(
  conn: Connection,
  idEvento: number,
  idsPalestrantes: number[],
): Promise<void> {
  const values = idsPalestrantes.map(() => "?").join(", ");

  await conn.execute(
    `delete from ${SCHEMA}.evento_palestrante` +
      ` where id_evento = ?` +
      ` and id_palestrante in (${values})`,
    [idEvento, ...idsPalestrantes],
  );
}

export async function getPalestrantesByIdEvento(
  id: number,
): Promise<Palestrante[]> {
  return constructPalestranteList(
    await execute<PalestranteDB[]>(
      `select o.* from ${SCHEMA}.evento_palestrante eo` +
        ` join ${SCHEMA}.palestrante o on eo.id_palestrante = o.id` +
        ` where eo.id_evento = ?` +
        ` order by o.id`,
      [id],
    ),
  );
}

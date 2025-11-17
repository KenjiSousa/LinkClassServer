import { PalestranteDB } from "#dbTypes/palestranteDB.js";
import { execute } from "#util/dbUtils.js";
import { Palestrante } from "#model/palestrante.js";
import { InsertResult } from "#interfaces/dbInterfaces.js";

const SCHEMA = process.env.DB_SCHEMA;

function constructPalestrante(rows: PalestranteDB[]): Palestrante | null {
  if (!rows || rows.length === 0) return null;

  const palestrante = new Palestrante(rows[0].nome!, rows[0].descricao);

  palestrante.id = rows[0]["id"];

  return palestrante;
}

export function constructPalestranteList(rows: PalestranteDB[]): Palestrante[] {
  if (!rows || rows.length === 0) return [];

  const palestrantes: Palestrante[] = [];

  for (const row of rows) {
    palestrantes.push(constructPalestrante([row])!);
  }

  return palestrantes;
}

export async function inserePalestrantes(palestrante: Palestrante) {
  const result = await execute<InsertResult>(
    `insert into ${SCHEMA}.palestrante(` +
      `nome, descricao)` +
      ` values (?, ?)`,
    [palestrante.nome, palestrante.descricao ?? null],
  );

  palestrante.id = result.insertId;
}

export async function getPalestranteById(id: number) {
  return constructPalestrante(
    await execute<PalestranteDB[]>(
      `select * from ${SCHEMA}.palestrante where id = ?`,
      [id],
    ),
  );
}

export async function getPalestrantesByIds(ids: number[]) {
  const values = ids.map(() => "?").join(", ");

  return constructPalestranteList(
    await execute<PalestranteDB[]>(
      `select * from ${SCHEMA}.palestrante where id in (${values})`,
      ids,
    ),
  );
}

export async function consultaPalestrantes(
  nome?: string,
  descricao?: string,
): Promise<Palestrante[]> {
  let filtro = "";
  const values: any[] = [];

  function concatFiltro(valor: any, condicao: string) {
    if (valor) {
      filtro += (filtro ? " and " : " where ") + condicao;
      values.push(valor);
    }
  }

  concatFiltro(nome, "upper(nome) like concat('%', upper(?), '%')");
  concatFiltro(descricao, "upper(descricao) like concat('%', upper(?), '%')");

  const result = await execute<PalestranteDB[]>(
    `select * from ${SCHEMA}.palestrante${filtro}`,
    values,
  );

  return constructPalestranteList(result);
}

export async function updatePalestrante(palestrante: Palestrante) {
  await execute(
    `update ${SCHEMA}.palestrante` +
      ` set nome = ?,` +
      ` descricao = ?` +
      ` where id = ?`,
    [palestrante.nome, palestrante.descricao ?? null, palestrante.id!],
  );
}

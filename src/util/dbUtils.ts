import { conn } from "#infrastructure/connectionFactory.js";

/**
 * Executa comando SQL.
 *
 * @param stmt {string} Comando a ser executado
 * @param values {any[]} Lista de valores a substituir os *placeholders*
 * @returns {T} Lista de objetos retornada do banco
 */
export function execute<T>(stmt: string, values: any[] = []): Promise<T> {
  return new Promise((resolve, reject) => {
    conn.query(stmt, values, (err, rows: T) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}

/**
 * Converte um objeto Date para uma string no formato `AAAA-MM-DD`, respeitando
 * o fuso-horário local. Retorna "" se `data` for `null` ou `undefined`.
 *
 * @param data {Date} Data a ser convertida
 * @returns {string} Data como string formatada
 */
export const dateToString = (data?: Date): string => {
  if (!data) return "";

  return new Intl.DateTimeFormat("sv").format(data);
};

/**
 * Arredonda para 00:00 o horário de um objeto Date, respeitando o
 * fuso-horário local.
 *
 * @param data {Date} Data a ser arredondada
 * @returns {Date} Data arredondada
 */
export const truncDate = (data: Date): Date => {
  return new Date(data.getFullYear(), data.getMonth(), data.getDate());
};

/**
 * Retorna um novo objeto {Data} com base em string no formato `AAAA-MM-DD`,
 * respeitando o fuso-horário local.
 *
 * @param data {string} String contento a data no formato `AAAA-MM-DD`
 * @returns {Data}
 * @throws {Error} Se a string não for uma data válida
 */
export const localDateFromString = (data: string): Date => {
  if (!data.match(/^\d{4}-\d\d-\d\d$/) || isNaN(new Date(data).valueOf())) {
    throw new Error("Data inválida");
  }

  const [year, month, day] = data.split("-").map(Number);

  return new Date(year, month - 1, day);
};

/**
 * Retorna um novo objeto {Data} com base em string no formato `AAAA-MM-DD HH:mm`,
 * respeitando o fuso-horário local.
 *
 * @param data {string} String contento a data no formato `AAAA-MM-DD HH:mm`
 * @returns {Data}
 * @throws {Error} Se a string não for uma data válida
 */
export const localDateTimeFromString = (data: string): Date => {
  if (
    !data.match(/^\d{4}-\d\d-\d\d (?:[0-1][0-9]|2[0-3]):[0-5][0-9]$/) ||
    isNaN(new Date(data).valueOf())
  ) {
    throw new Error("Data inválida");
  }

  const [year, month, day, hour, minute] = data.split(/[\- :]/).map(Number);

  return new Date(year, month - 1, day, hour, minute);
};

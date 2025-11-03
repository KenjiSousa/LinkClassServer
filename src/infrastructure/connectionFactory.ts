import mysql from "mysql";

export const pool = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST ?? "",
  user: process.env.DB_USER ?? "",
  password: process.env.DB_PASS ?? "",
});

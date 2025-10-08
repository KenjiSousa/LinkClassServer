import { UsuarioDB } from "#dbTypes/usuarioDB.js";
import { execute } from "#util/dbUtils.js";
import { Usuario } from "#model/usuario.js";

const SCHEMA = process.env.DB_SCHEMA;

function constructUsuario(rows?: UsuarioDB[]): Usuario | null {
  if (!rows || rows.length === 0) return null;

  const usuario = new Usuario(rows[0].email, rows[0].device_id, rows[0].papel);

  return usuario;
}

export async function getUsuarioByEmail(
  email: string,
): Promise<Usuario | null> {
  return constructUsuario(
    await execute<UsuarioDB[]>(
      `select * from ${SCHEMA}.usuario where email = ?`,
      [email],
    ),
  );
}

export async function getUsuarioByDeviceId(
  deviceId: string,
): Promise<Usuario | null> {
  return constructUsuario(
    await execute<UsuarioDB[]>(
      `select * from ${SCHEMA}.usuario where device_id = ?`,
      [deviceId],
    ),
  );
}

export async function insereUsuario(email: string, deviceId: string) {
  await execute(
    `insert into ${SCHEMA}.usuario(email, device_id, papel)` +
      ` values (?, ?, 'aluno')`,
    [email, deviceId],
  );
}

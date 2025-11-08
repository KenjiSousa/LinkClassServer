import { ApiError } from "#error/apiError.js";
import { CamposErro } from "#interfaces/errorInterfaces.js";
import { assertNotEmpty, validaCampos } from "#util/assertion.js";
import { LoginTicket, OAuth2Client } from "google-auth-library";
import * as UsuarioService from "#service/usuarioService.js";
import { Usuario } from "#model/usuario.js";
import { UserPayload } from "#interfaces/authInterfaces.js";

async function getUsuarioByEmailAndDeviceId(
  email: string,
  deviceId: string,
): Promise<Usuario> {
  let usuarioByEmail: Usuario | null = null;

  try {
    usuarioByEmail = await UsuarioService.getUsuarioByEmail(email);
  } catch (err) {
    if (!(err instanceof ApiError) || err.statusCode !== 404) {
      throw err;
    }
  }

  const usuarioByDeviceId: Usuario | null =
    await UsuarioService.getUsuarioByDeviceId(deviceId);

  if (!usuarioByEmail && !usuarioByDeviceId) {
    await UsuarioService.insereUsuario(email, deviceId);

    return await UsuarioService.getUsuarioByEmail(email);
  } else if (usuarioByEmail && usuarioByEmail.deviceId !== deviceId) {
    throw new ApiError(
      409,
      "Já existe outro dispositivo ligado a esta conta. Solicite a ajuda de um administrador para prosseguir.",
    );
  } else if (usuarioByDeviceId && usuarioByDeviceId.email !== email) {
    throw new ApiError(
      409,
      "Já existe outra conta ligado a este dispositivo. Solicite a ajuda de um administrador para prosseguir.",
    );
  }

  return usuarioByEmail!;
}

export async function login(
  idToken: string | undefined,
  deviceId: string | undefined,
): Promise<UserPayload> {
  {
    const campos: CamposErro = {};

    assertNotEmpty(idToken, campos, "idToken", "idToken é obrigatório");
    assertNotEmpty(deviceId, campos, "deviceId", "deviceId é obrigatório");

    validaCampos(campos);
  }

  const CLIENT_ID = process.env.GOOGLE_WEB_CLIENT_ID;
  const client = new OAuth2Client(CLIENT_ID);

  let ticket: LoginTicket;

  try {
    ticket = await client.verifyIdToken({
      idToken: idToken!,
      audience: CLIENT_ID,
    });
  } catch (err) {
    throw new ApiError(401, "idToken inválido");
  }

  const payload: UserPayload | undefined = ticket.getPayload() as UserPayload;

  if (payload?.hd !== "edu.unipar.br") {
    throw new ApiError(
      403,
      "Só é possível realizar login com uma conta Gmail Unipar (@edu.unipar.br)",
    );
  }

  const usuario = await getUsuarioByEmailAndDeviceId(payload.email!, deviceId!);

  payload.deviceId = usuario.deviceId;
  payload.papel = usuario.papel;

  return payload;
}

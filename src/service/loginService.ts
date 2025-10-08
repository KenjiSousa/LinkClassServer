import { ApiError } from "#error/apiError.js";
import { CamposErro } from "#interfaces/errorInterfaces.js";
import { assertNotBlank, validaCampos } from "#util/assertion.js";
import { LoginTicket, OAuth2Client } from "google-auth-library";
import * as UsuarioService from "#service/usuarioService.js";

async function validaLoginDispositivo(email: string, deviceId: string) {
  const usuarioByEmail = await UsuarioService.getUsuarioByEmail(email);

  if (!usuarioByEmail) {
    UsuarioService.insereUsuario(email, deviceId);

    return;
  }

  const usuarioByDeviceId = await UsuarioService.getUsuarioByDeviceId(deviceId);

  if (!usuarioByDeviceId || usuarioByDeviceId!.email !== usuarioByEmail.email) {
    throw new ApiError(
      409,
      "Já existe outra conta ligado a este dispositivo. Solicite a ajuda de um administrador para prosseguir.",
    );
  }
}

export async function login(
  idToken: string | undefined,
  deviceId: string | undefined,
) {
  console.log(deviceId);

  {
    const campos: CamposErro = {};

    assertNotBlank(idToken, campos, "idToken", "idToken é obrigatório");
    assertNotBlank(deviceId, campos, "deviceId", "deviceId é obrigatório");

    validaCampos(campos);
  }

  console.log(`deviceId: ${deviceId}`);

  const CLIENT_ID =
    "42851321777-1tpjtassb4vqfkp61stv6287flq6iejl.apps.googleusercontent.com";
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

  const payload = ticket.getPayload();

  console.log(`hd: ${payload?.hd}`);
  console.log(`email: ${payload?.email}`);

  if (payload?.hd !== "edu.unipar.br") {
    throw new ApiError(403, "Domínio inválido de e-mail");
  }

  await validaLoginDispositivo(payload.email!, deviceId!);

  return payload;
}

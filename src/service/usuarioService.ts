import { ApiError } from "#error/apiError.js";
import { DupVal } from "#error/repoError.js";
import * as UsuarioRepo from "#repository/usuarioRepo.js";

export async function getUsuarioByEmail(email: string) {
  return await UsuarioRepo.getUsuarioByEmail(email);
}

export async function getUsuarioByDeviceId(deviceId: string) {
  return await UsuarioRepo.getUsuarioByDeviceId(deviceId);
}

export async function insereUsuario(email: string, deviceId: string) {
  try {
    return await UsuarioRepo.insereUsuario(email, deviceId);
  } catch (err: any) {
    if (err instanceof DupVal) {
      throw new ApiError(
        409,
        "Já existe outro dispositivo ligado a esta conta. Solicite a ajuda de um administrador para prosseguir.",
      );
    }

    throw err;
  }
}

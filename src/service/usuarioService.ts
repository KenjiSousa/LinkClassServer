import { ApiError } from "#error/apiError.js";
import { DupVal } from "#error/repoError.js";
import { Usuario } from "#model/usuario.js";
import * as UsuarioRepo from "#repository/usuarioRepo.js";

export async function getUsuarioByEmail(email: string): Promise<Usuario> {
  const usuario: Usuario | null = await UsuarioRepo.getUsuarioByEmail(email);

  if (!usuario)
    throw new ApiError(404, `Usuário de e-mail ${email} não encontrado`);

  return usuario;
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

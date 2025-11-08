import { ApiError } from "#error/apiError.js";
import { DupVal } from "#error/repoError.js";
import { CamposErro } from "#interfaces/errorInterfaces.js";
import { Usuario } from "#model/usuario.js";
import * as UsuarioRepo from "#repository/usuarioRepo.js";
import { assertNotEmpty, assertTrue, validaCampos } from "#util/assertion.js";

export async function getUsuarioByEmail(email: string): Promise<Usuario> {
  const usuario: Usuario | null = await UsuarioRepo.getUsuarioByEmail(email);

  if (!usuario)
    throw new ApiError(404, `Usuário de e-mail ${email} não encontrado`);

  return usuario;
}

export async function getUsuarioByDeviceId(
  deviceId: string,
): Promise<Usuario | null> {
  return await UsuarioRepo.getUsuarioByDeviceId(deviceId);
}

export async function insereUsuario(
  email: string,
  deviceId: string,
): Promise<void> {
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

export async function setRa(
  email: string,
  ra: string | undefined,
): Promise<void> {
  {
    const campos: CamposErro = {};

    if (assertNotEmpty(ra, campos, "ra", "ra é obrigatório")) {
      assertTrue(ra.length === 8, campos, "ra", "RA deve ter 8 caracteres");
    }

    validaCampos(campos);
  }

  const usuario: Usuario = await getUsuarioByEmail(email);

  usuario.ra = ra!;

  UsuarioRepo.updateUsuario(usuario);
}

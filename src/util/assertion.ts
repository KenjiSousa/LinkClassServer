import { ApiError } from "#error/apiError.js";
import { CamposErro } from "#interfaces/errorInterfaces.js";
import { localDateFromString } from "#util/dbUtils.js";

export function assertNotEmpty<T>(
  s: T | null | undefined,
  camposErro: CamposErro,
  nomeCampo: string,
  message: string,
): s is T {
  if (!s || (s instanceof String && s.trim() === "")) {
    camposErro[nomeCampo] = message;

    return false;
  }

  return true;
}

export function assertTrue(
  cond: any,
  camposErro: CamposErro,
  nomeCampo: string,
  message: string,
) {
  if (!cond) {
    camposErro[nomeCampo] = message;

    return false;
  }

  return true;
}

export function assertValidDateStr(
  s: string,
  camposErro: CamposErro,
  nomeCampo: string,
  message: string,
) {
  try {
    if (isNaN(localDateFromString(s).valueOf())) {
      camposErro[nomeCampo] = message;

      return false;
    }
  } catch (err) {
    camposErro[nomeCampo] = message;

    return false;
  }

  return true;
}

export function assertValidHrStr(
  s: string,
  camposErro: CamposErro,
  nomeCampo: string,
  message: string,
) {
  if (!s.match(/^(?:[0-1][0-9]|2[0-3]):[0-5][0-9]$/)) {
    camposErro[nomeCampo] = message;

    return false;
  }

  return true;
}

export function assertArrayNotNull<T>(
  s: T[] | null | undefined,
  camposErro: CamposErro,
  nomeCampo: string,
  message: string,
): s is T[] {
  if (!s) {
    camposErro[nomeCampo] = message;

    return false;
  }

  return true;
}

export function validaCampos(camposErro: CamposErro) {
  if (Object.keys(camposErro).length > 0) {
    throw new ApiError(400, "Requisição inválida", camposErro);
  }
}

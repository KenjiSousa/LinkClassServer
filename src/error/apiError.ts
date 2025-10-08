import { CamposErro } from "#interfaces/errorInterfaces.js";

export class ApiError extends Error {
  statusCode: number;
  campos: CamposErro;

  constructor(statusCode: number, message: string, campos?: CamposErro) {
    super(message);

    this.statusCode = statusCode;
    this.campos = campos ?? {};
  }
}

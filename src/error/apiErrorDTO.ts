import { CamposErro } from "#interfaces/errorInterfaces.js";

export class ApiErrorDTO {
  message: string;
  campos?: CamposErro;

  constructor(message: string, campos?: CamposErro) {
    this.message = message;
    if (Object.keys(campos as Object).length > 0) this.campos = campos;
  }
}

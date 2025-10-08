import { UsuarioPapel } from "#dbTypes/usuarioPapel.js";

export class Usuario {
  email: string;
  deviceId: string;
  papel: UsuarioPapel;

  constructor(email: string, deviceId: string, papel: UsuarioPapel) {
    this.email = email;
    this.deviceId = deviceId;
    this.papel = papel;
  }
}

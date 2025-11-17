import { UsuarioPapel } from "#dbTypes/usuarioPapel.js";

export class Usuario {
  email: string;
  deviceId: string;
  papel: UsuarioPapel;
  ra?: string;

  constructor(
    email: string,
    deviceId: string,
    papel: UsuarioPapel,
    ra?: string,
  ) {
    this.email = email;
    this.deviceId = deviceId;
    this.papel = papel;
    this.ra = ra;
  }
}

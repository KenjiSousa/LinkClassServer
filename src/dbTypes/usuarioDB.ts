import { UsuarioPapel } from "./usuarioPapel.js";

export class UsuarioDB {
  email: string;
  device_id: string;
  papel: UsuarioPapel;
  ra: string;

  constructor(
    email: string,
    device_id: string,
    papel: UsuarioPapel,
    ra: string,
  ) {
    this.email = email;
    this.device_id = device_id;
    this.papel = papel;
    this.ra = ra;
  }
}

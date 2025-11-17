import { UsuarioPapel } from "#dbTypes/usuarioPapel.js";
import { Usuario } from "#model/usuario.js";

export class UsuarioDTO {
  email: string;
  deviceId: string;
  papel: UsuarioPapel;
  ra?: string;

  constructor(usuario: Usuario) {
    this.email = usuario.email;
    this.deviceId = usuario.deviceId;
    this.papel = usuario.papel;
    this.ra = usuario.ra;
  }
}

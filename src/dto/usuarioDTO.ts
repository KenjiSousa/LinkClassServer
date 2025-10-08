import { UsuarioPapel } from "#dbTypes/usuarioPapel.js";
import { Usuario } from "#model/usuario.js";

export class UsuarioDTO {
  email: string;
  deviceId: string;
  papel: UsuarioPapel;

  constructor(usuario: Usuario) {
    this.email = usuario.email;
    this.deviceId = usuario.deviceId;
    this.papel = usuario.papel;
  }
}

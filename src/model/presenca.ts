import { Evento } from "#model/evento.js";
import { Usuario } from "#model/usuario.js";

export class Presenca {
  id?: number;
  usuario: Usuario;
  evento: Evento;

  constructor(usuario: Usuario, evento: Evento) {
    this.usuario = usuario;
    this.evento = evento;
  }
}

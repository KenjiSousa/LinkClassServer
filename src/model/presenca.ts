import { Evento } from "#model/evento.js";
import { Usuario } from "#model/usuario.js";

export class Presenca {
  id?: number;
  usuario: Usuario;
  evento: Evento;
  dataHora?: Date;

  constructor(usuario: Usuario, evento: Evento, dataHora?: Date) {
    this.usuario = usuario;
    this.evento = evento;
    this.dataHora = dataHora;
  }
}

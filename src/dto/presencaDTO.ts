import { Presenca } from "#model/presenca.js";
import { UsuarioDTO } from "#dto/usuarioDTO.js";
import { EventoDTO } from "#dto/eventoDTO.js";

export class PresencaDTO {
  id?: number;
  usuario: UsuarioDTO;
  evento: EventoDTO;

  constructor(presenca: Presenca) {
    this.id = presenca.id;
    this.usuario = new UsuarioDTO(presenca.usuario);
    this.evento = new EventoDTO(presenca.evento);
  }
}

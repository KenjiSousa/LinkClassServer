import { EventoStatus } from "#dbTypes/eventoStatus.js";
import { Evento } from "#model/evento.js";
import { Palestrante } from "#model/palestrante.js";
import { dateToString, truncDate } from "#util/dbUtils.js";

export class EventoDTO {
  id?: number;
  nome?: string;
  data?: string;
  hr_ini?: string;
  hr_fim?: string;
  logradouro?: string;
  numero?: string;
  palestrantes?: Palestrante[];
  tema?: string;
  status?: EventoStatus;
  obs?: string;

  constructor(evento: Evento) {
    this.id = evento.id;
    this.nome = evento.nome;
    this.data = evento.data ? dateToString(truncDate(evento.data)) : "";
    this.hr_ini = evento.hrIni.slice(0, 5);
    this.hr_fim = evento.hrFim.slice(0, 5);
    this.logradouro = evento.logradouro;
    this.numero = evento.numero;
    this.palestrantes = evento.palestrantes;
    this.tema = evento.tema;
    this.status = evento.status;
    this.obs = evento.obs;
  }
}

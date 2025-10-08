import { EventoStatus } from "#dbTypes/eventoStatus.js";

export class EventoDB {
  id?: number;
  nome?: string;
  data?: Date;
  hr_ini?: string;
  hr_fim?: string;
  logradouro?: string;
  numero?: string;
  orador?: string;
  tema?: string;
  status?: EventoStatus;
  obs?: string;

  constructor(
    nome?: string,
    data?: Date,
    hr_ini?: string,
    hr_fim?: string,
    logradouro?: string,
    numero?: string,
    orador?: string,
    tema?: string,
    status?: EventoStatus,
    obs?: string,
  ) {
    this.nome = nome;
    this.data = data;
    this.hr_ini = hr_ini;
    this.hr_fim = hr_fim;
    this.logradouro = logradouro;
    this.numero = numero;
    this.orador = orador;
    this.tema = tema;
    this.status = status;
    this.obs = obs;
  }
}

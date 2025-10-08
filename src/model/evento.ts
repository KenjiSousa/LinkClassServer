import { EventoStatus } from "#dbTypes/eventoStatus.js";

export class Evento {
  id?: number;
  nome: string;
  data: Date;
  hrIni: string;
  hrFim: string;
  logradouro: string;
  numero: string | undefined;
  orador: string;
  tema: string;
  status: EventoStatus;
  obs: string | undefined;

  constructor(
    nome: string,
    data: Date,
    hrIni: string,
    hrFim: string,
    logradouro: string,
    numero: string | undefined,
    orador: string,
    tema: string,
    status: EventoStatus,
    obs: string | undefined,
  ) {
    this.nome = nome;
    this.data = data;
    this.hrIni = hrIni;
    this.hrFim = hrFim;
    this.logradouro = logradouro;
    this.numero = numero;
    this.orador = orador;
    this.tema = tema;
    this.status = status;
    this.obs = obs;
  }
}

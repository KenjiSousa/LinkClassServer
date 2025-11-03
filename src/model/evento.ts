import { EventoStatus } from "#dbTypes/eventoStatus.js";
import { Palestrante } from "./palestrante.js";

export class Evento {
  id?: number;
  nome: string;
  data: Date;
  hrIni: string;
  hrFim: string;
  logradouro: string;
  numero: string | undefined;
  palestrantes: Palestrante[];
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
    palestrantes: Palestrante[],
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
    this.palestrantes = palestrantes;
    this.tema = tema;
    this.status = status;
    this.obs = obs;
  }
}

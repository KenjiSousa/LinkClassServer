import { Palestrante } from "#model/palestrante.js";

export class PalestranteDTO {
  id?: number;
  nome?: string;
  descricao?: string;

  constructor(palestrante: Palestrante) {
    this.id = palestrante.id;
    this.nome = palestrante.nome;
    this.descricao = palestrante.descricao;
  }
}

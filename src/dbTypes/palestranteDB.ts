export class PalestranteDB {
  id?: number;
  nome?: string;
  descricao?: string;

  constructor(nome?: string, descricao?: string) {
    this.nome = nome;
    this.descricao = descricao;
  }
}

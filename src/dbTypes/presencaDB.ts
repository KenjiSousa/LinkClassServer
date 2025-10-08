export class PresencaDB {
  id: number;
  email_usuario: string;
  id_evento: number;

  constructor(id: number, email_usuario: string, id_evento: number) {
    this.id = id;
    this.email_usuario = email_usuario;
    this.id_evento = id_evento;
  }
}

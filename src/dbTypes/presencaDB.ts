export class PresencaDB {
  id: number;
  email_usuario: string;
  id_evento: number;
  dt_record: Date;

  constructor(
    id: number,
    email_usuario: string,
    id_evento: number,
    dt_record: Date,
  ) {
    this.id = id;
    this.email_usuario = email_usuario;
    this.id_evento = id_evento;
    this.dt_record = dt_record;
  }
}

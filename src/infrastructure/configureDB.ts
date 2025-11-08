import { log } from "#logger.js";
import { execute } from "#util/dbUtils.js";

const SCHEMA = process.env.DB_SCHEMA;

export async function configureDB() {
  if ((await getSchemaCount()) === 0) {
    createTables();
  }
}

const getSchemaCount = async (): Promise<number> => {
  const rows = await execute<{ COUNT: number }[]>(
    `select count(*) COUNT from information_schema.tables` +
      ` where TABLE_SCHEMA = '${SCHEMA}'` +
      ` and TABLE_NAME = 'usuario'`,
  );

  return Number(rows[0].COUNT);
};

const createTables = async (): Promise<void> => {
  await createTableUsuario();
  await createTablePalestrante();
  await createTableEvento();
  await createTableEventoPalestrante();
  await createTablePresenca();
};

async function createTableUsuario() {
  await execute(
    `create table ${SCHEMA}.usuario(` +
      `email varchar(200) primary key,` +
      `device_id varchar(40),` +
      `papel enum('aluno', 'admin') not null,` +
      `ra varchar(8),` +
      `dt_record timestamp default current_timestamp not null` +
      `)`,
  );
  log("criada tabela usuario com sucesso");
}

async function createTablePalestrante() {
  await execute(
    `create table ${SCHEMA}.palestrante(` +
      `id serial primary key,` +
      `nome varchar(100) not null,` +
      `descricao varchar(1000),` +
      `dt_record timestamp default current_timestamp not null` +
      `)`,
  );
  log("criada tabela palestrante com sucesso");
}

async function createTableEvento() {
  await execute(
    `create table ${SCHEMA}.evento(` +
      `id serial primary key,` +
      `nome varchar(100) not null,` +
      `data date not null,` +
      `hr_ini time not null,` +
      `hr_fim time not null,` +
      `logradouro varchar(100) not null,` +
      `numero varchar(30),` +
      `tema varchar(100) not null,` +
      `status enum('aberto', 'encerrado', 'cancelado') not null,` +
      `obs varchar(255),` +
      `dt_record timestamp default current_timestamp not null` +
      `)`,
  );
  log("criada tabela evento com sucesso");
}

async function createTableEventoPalestrante() {
  await execute(
    `create table ${SCHEMA}.evento_palestrante(` +
      `id_evento bigint unsigned not null,` +
      `id_palestrante bigint unsigned not null,` +
      `dt_record timestamp default current_timestamp not null,` +
      `foreign key (id_evento) references ${SCHEMA}.evento(id),` +
      `foreign key (id_palestrante) references ${SCHEMA}.palestrante(id),` +
      `primary key (id_evento, id_palestrante)` +
      `)`,
  );
  log("criada tabela evento_palestrante com sucesso");
}

async function createTablePresenca() {
  await execute(
    `create table ${SCHEMA}.presenca(` +
      `id serial primary key,` +
      `email_usuario varchar(40) not null,` +
      `id_evento bigint unsigned not null,` +
      `dt_record timestamp default current_timestamp not null,` +
      `foreign key (email_usuario) references ${SCHEMA}.usuario(email),` +
      `foreign key (id_evento) references ${SCHEMA}.evento(id),` +
      `unique key uk_presenca_usuario_evento (email_usuario, id_evento)` +
      `)`,
  );
  log("criada tabela presenca com sucesso");
}

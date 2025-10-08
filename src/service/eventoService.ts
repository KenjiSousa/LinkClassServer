import { ApiError } from "#error/apiError.js";
import {
  dateToString,
  localDateFromString,
  localDateTimeFromString,
  truncDate,
} from "#util/dbUtils.js";
import { Evento } from "#model/evento.js";
import * as EventoRepo from "#repository/eventoRepo.js";
import {
  assertNotBlank,
  assertNotEmpty,
  assertTrue,
  assertValidDateStr,
  assertValidHrStr,
  validaCampos,
} from "#util/assertion.js";
import { EventoStatus } from "#dbTypes/eventoStatus.js";
import { EventoDTO } from "#dto/eventoDTO.js";
import {
  EventoInsertRequestBody,
  EventoSelectRequestQuery,
  EventoUpdateRequestBody,
} from "#interfaces/eventoInterfaces.js";
import { CamposErro } from "#interfaces/errorInterfaces.js";

function validaStatus(
  status: string | undefined,
  campos: CamposErro,
  nomeCampo: string,
): status is EventoStatus | undefined {
  if (!status) return false;

  return assertTrue(
    ["aberto", "encerrado", "cancelado"].includes(status),
    campos,
    nomeCampo,
    "Status inválido",
  );
}

export const insereEvento = async (
  body: EventoInsertRequestBody,
): Promise<Evento> => {
  const {
    nome,
    data,
    hr_ini,
    hr_fim,
    logradouro,
    numero,
    orador,
    tema,
    status,
    obs,
  } = body;

  {
    const campos: CamposErro = {};

    assertNotEmpty(nome, campos, "nome", "Nome é obrigatório");

    if (assertNotEmpty(data, campos, "data", "Data é obrigatória")) {
      assertValidDateStr(data, campos, "data", "Data inválida");
      assertTrue(
        data >= dateToString(truncDate(new Date())),
        campos,
        "data",
        "Data não pode ser anterior à atual",
      );
    }

    let hrFimValido = true;

    if (
      assertNotEmpty(hr_ini, campos, "hr_ini", "Horário inicial é obrigatória")
    ) {
      assertValidHrStr(hr_ini, campos, "hr_ini", "Horário inicial inválido");
    }

    if (
      assertNotEmpty(hr_fim, campos, "hr_fim", "Horário final é obrigatória")
    ) {
      hrFimValido = assertValidHrStr(
        hr_fim,
        campos,
        "hr_fim",
        "Horário final inválido",
      );
    }

    if (hr_ini && hr_fim && hrFimValido) {
      assertTrue(
        hr_ini <= hr_fim,
        campos,
        "hr_fim",
        "Horário inicial não pode ser posterior à horário final",
      );
    }

    assertNotEmpty(
      logradouro,
      campos,
      "logradouro",
      "Logradouro é obrigatório",
    );
    assertNotEmpty(orador, campos, "orador", "Orador é obrigatório");
    assertNotEmpty(tema, campos, "tema", "Tema é obrigatório");

    if (assertNotEmpty(status, campos, "status", "Status é obrigatório")) {
      validaStatus(status, campos, "status");
    }

    validaCampos(campos);
  }

  const evento = new Evento(
    nome!,
    localDateFromString(data!),
    hr_ini!,
    hr_fim!,
    logradouro!,
    numero,
    orador!,
    tema!,
    status as EventoStatus,
    obs,
  );

  await EventoRepo.insereEvento(evento);

  return evento;
};

export const getEventoById = async (id: number): Promise<Evento | null> => {
  return await EventoRepo.getEventoById(id);
};

export const consultaEventos = async (
  query: EventoSelectRequestQuery,
): Promise<EventoDTO[]> => {
  const {
    nome,
    data_ini,
    data_fim,
    logradouro,
    numero,
    orador,
    tema,
    status,
    obs,
  } = query;

  {
    const campos: CamposErro = {};

    validaStatus(status, campos, "status");

    validaCampos(campos);
  }

  const eventos = await EventoRepo.consultaEventos(
    nome,
    data_ini,
    data_fim,
    logradouro,
    numero,
    orador,
    tema,
    status as EventoStatus | undefined,
    obs,
  );

  let eventosDto: EventoDTO[] = [];

  for (const evento of eventos) {
    eventosDto.push(new EventoDTO(evento));
  }

  return eventosDto;
};

export const updateEvento = async (
  id: number,
  body: EventoUpdateRequestBody,
) => {
  const {
    nome,
    data,
    hr_ini,
    hr_fim,
    logradouro,
    numero,
    orador,
    tema,
    status,
    obs,
  } = body;

  const eventoOld = await EventoRepo.getEventoById(id);

  if (!eventoOld) throw new ApiError(404, `Evento de id ${id} não encontrado`);

  const dataHoraOld = localDateTimeFromString(
    `${dateToString(eventoOld.data)} ${eventoOld.hrIni.slice(0, 5)}`,
  );

  if (!(dataHoraOld.valueOf() >= new Date().valueOf())) {
    throw new ApiError(
      403,
      "Evento não pode ser alterado depois de ter iniciado",
    );
  }

  const eventoNew = eventoOld;

  {
    const campos: CamposErro = {};

    eventoNew.nome = nome ?? eventoOld.nome;
    assertNotBlank(eventoNew.nome, campos, "nome", "Nome não deve estar vazio");

    if (data) {
      if (assertValidDateStr(data, campos, "data", "Data inválida")) {
        eventoNew.data = localDateFromString(data);
      }

      assertTrue(
        eventoNew.data.valueOf() >= truncDate(new Date()).valueOf(),
        campos,
        "data",
        "Data não pode ser anterior à atual",
      );
    }

    eventoNew.hrIni = hr_ini ?? eventoOld.hrIni;
    assertValidHrStr(
      eventoNew.hrIni,
      campos,
      "hr_ini",
      "Horário inicial inválido",
    );

    eventoNew.hrFim = hr_fim ?? eventoOld.hrFim;

    if (
      assertValidHrStr(
        eventoNew.hrFim,
        campos,
        "hr_fim",
        "Horário final inválido",
      )
    ) {
      assertTrue(
        eventoNew.hrIni <= eventoNew.hrFim,
        campos,
        "hr_fim",
        "Horário inicial não pode ser posterior à horário final",
      );
    }

    eventoNew.logradouro = logradouro ?? eventoOld.logradouro;
    eventoNew.numero = numero ?? eventoOld.numero;
    eventoNew.orador = orador ?? eventoOld.orador;
    eventoNew.tema = tema ?? eventoOld.tema;
    assertNotEmpty(
      eventoNew.logradouro,
      campos,
      "logradouro",
      "Logradouro é obrigatório",
    );
    assertNotEmpty(eventoNew.orador, campos, "orador", "Orador é obrigatório");
    assertNotEmpty(eventoNew.tema, campos, "tema", "Tema é obrigatório");

    if (status) {
      if (validaStatus(status, campos, "status")) {
        eventoNew.status = status;

        if (eventoOld.status !== eventoNew.status) {
          assertTrue(
            eventoOld.status === eventoNew.status,
            campos,
            "status",
            "Status não pode ser alterado",
          );
        }
      }
    }

    validaCampos(campos);
  }

  eventoNew.obs = obs;

  return await EventoRepo.updateEvento(eventoNew);
};

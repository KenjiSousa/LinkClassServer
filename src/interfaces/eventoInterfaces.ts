import { Request } from "express";

export interface EventoInsertRequestBody {
  nome?: string;
  data?: string;
  hr_ini?: string;
  hr_fim?: string;
  logradouro?: string;
  numero?: string;
  palestrantes?: number[];
  tema?: string;
  status?: string;
  obs?: string;
}

export interface EventoInsertRequest
  extends Request<{}, {}, EventoInsertRequestBody> {}

export interface EventoSelectRequestQuery {
  nome?: string;
  data_ini?: string;
  data_fim?: string;
  logradouro?: string;
  numero?: string;
  palestrante?: string;
  tema?: string;
  status?: string;
  obs?: string;
}

export interface EventoSelectRequest
  extends Request<{}, {}, {}, EventoSelectRequestQuery> {}

export interface EventoUpdateRequestParams {
  id?: string;
}

export interface EventoUpdateRequestBody {
  nome?: string;
  data?: string;
  hr_ini?: string;
  hr_fim?: string;
  logradouro?: string;
  numero?: string;
  palestrantes?: number[];
  tema?: string;
  status?: string;
  obs?: string;
}

export interface EventoUpdateRequest
  extends Request<EventoUpdateRequestParams, {}, EventoUpdateRequestBody> {}

export interface EventoDeleteRequest
  extends Request<EventoUpdateRequestParams> {}

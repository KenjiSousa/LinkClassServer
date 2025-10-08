import { Request } from "express";

export interface PresencaLinkGenerateRequestQuery {
  id_evento?: number;
}

export interface PresencaLinkGenerateRequest
  extends Request<{}, {}, {}, PresencaLinkGenerateRequestQuery> {}

export interface PresencaInsertRequestBody {
  email_usuario?: string;
  id_evento?: number;
}

export interface PresencaSelectRequestQuery {
  email_usuario?: string;
  id_evento?: number;
  nome_evento?: string;
}

export interface PresencaLinkVerifyRequestQuery {
  hash?: string;
}

export interface PresencaLinkVerifyRequest
  extends Request<{}, {}, {}, PresencaLinkVerifyRequestQuery> {}

export interface PresencaSelectRequest
  extends Request<{}, {}, {}, PresencaSelectRequestQuery> {}

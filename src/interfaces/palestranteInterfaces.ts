import { Request } from "express";

export interface PalestranteInsertRequestBody {
  nome?: string;
  descricao?: string;
}

export interface PalestranteInsertRequest
  extends Request<{}, {}, PalestranteInsertRequestBody> {}

export interface PalestranteSelectRequestQuery {
  nome?: string;
  descricao?: string;
}

export interface PalestranteSelectRequest
  extends Request<{}, {}, {}, PalestranteSelectRequestQuery> {}

export interface PalestranteUpdateRequestParams {
  id?: string;
}

export interface PalestranteUpdateRequestBody {
  nome?: string;
  descricao?: string;
}

export interface PalestranteUpdateRequest
  extends Request<
    PalestranteUpdateRequestParams,
    {},
    PalestranteUpdateRequestBody
  > {}

export interface PalestranteDeleteRequest
  extends Request<PalestranteUpdateRequestParams> {}

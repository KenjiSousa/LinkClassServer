import { Request } from "express";

export interface SetRaRequestBody {
  ra?: string;
}

export interface SetRaRequest extends Request<{}, {}, SetRaRequestBody> {}

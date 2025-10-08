import { Request } from "express";

export interface LoginRequestBody {
  idToken?: string;
  deviceId?: string;
}

export interface LoginRequest extends Request<{}, {}, LoginRequestBody, {}> {}

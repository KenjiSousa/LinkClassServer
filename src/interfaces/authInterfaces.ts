import { UsuarioPapel } from "#dbTypes/usuarioPapel.js";
import { Request } from "express";
import { TokenPayload } from "google-auth-library";

export interface LoginRequestBody {
  idToken?: string;
  deviceId?: string;
}

export interface LoginRequest extends Request<{}, {}, LoginRequestBody, {}> {}

export interface UserPayload extends TokenPayload {
  deviceId?: string;
  papel?: UsuarioPapel;
}

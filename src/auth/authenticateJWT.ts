import { UsuarioDTO } from "#dto/usuarioDTO.js";
import { Usuario } from "#model/usuario.js";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

declare module "express-serve-static-core" {
  interface Request {
    usuario?: UsuarioDTO;
  }
}

export function authenticateJWT(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.log(JSON.stringify(req.cookies));
  let token: string | undefined = req.cookies.token;

  if (!token) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res
        .status(401)
        .json({ message: "Não foi encontrado header de autorização" });
    }

    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Não foi encontrado token de autorização" });
  }

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET ?? "");

    req.usuario = new UsuarioDTO(
      new Usuario(decoded.email, decoded.deviceId, decoded.papel, undefined),
    );

    next();
  } catch (error) {
    return res.status(403).json({ message: "Token inválido" });
  }
}

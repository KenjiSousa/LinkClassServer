import { ApiError } from "#error/apiError.js";
import { Request, Response, NextFunction } from "express";

export default function adminOnly(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  if (req.usuario?.papel !== "admin") {
    throw new ApiError(
      403,
      "Esta operação só é acessível para administradores.",
    );
  }

  next();
}

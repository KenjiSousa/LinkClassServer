import { ErrorRequestHandler } from "express";
import { ApiError } from "#error/apiError.js";
import { log } from "#logger.js";
import { ApiErrorDTO } from "#error/apiErrorDTO.js";

const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res
      .status(err.statusCode)
      .send(new ApiErrorDTO(err.message, err.campos));
  } else {
    log(`${err.message}\n${err.stack}`);
    return res.status(500).send({ message: "Erro interno" });
  }
};

export default errorHandler;

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { authenticateJWT } from "#auth/authenticateJWT.js";
import { configureDB } from "#infrastructure/configureDB.js";
import { log } from "#logger.js";
import loginController from "#controller/loginController.js";
import usuarioController from "#controller/usuarioController.js";
import palestranteController from "#controller/palestranteController.js";
import eventoController from "#controller/eventoController.js";
import presencaController from "#controller/presencaController.js";
import presencaLinkController from "#controller/presencaLinkController.js";
import errorHandler from "#error/errorHandler.js";
import cookieParser from "cookie-parser";

await configureDB();

const router = express.Router();

router.use("/login", loginController);
router.use("/usuario", authenticateJWT, usuarioController);
router.use("/palestrante", authenticateJWT, palestranteController);
router.use("/evento", authenticateJWT, eventoController);
router.use("/presenca", authenticateJWT, presencaController);
router.use("/presenca-link", authenticateJWT, presencaLinkController);

const app = express();

app.use(
  cors({
    // Para testes com o NextJS
    origin: "http://localhost:3001",
    credentials: true,
  }),
);

app.use(cookieParser());

app.use("/api", bodyParser.json(), router, errorHandler);

const port = process.env.PORT ?? "3000";

app.listen(port, () => {
  log(`LinkClassServer listening on port ${port}`);
});

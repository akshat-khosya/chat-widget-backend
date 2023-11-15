import * as express from "express";
import { createServer } from "http";
import { config, connect, expressServer, log } from "./utils";
import socketServer from "./socket/socket";
import { createUserHandler } from "./controller";
import { userCreateSchema } from "./schema";
import { validate } from "./middleware";

const port = config.get("port") as number;

const api = express.Router();

const app = expressServer();

connect();

api.post("/user", validate(userCreateSchema), createUserHandler);

app.use("/api/v1", api);

const httpServer = createServer(app);

const io = socketServer(httpServer);

httpServer.listen(port, () => {
  log.info(`Server is listening on url http://localhost:${port}`);
});

export { io };

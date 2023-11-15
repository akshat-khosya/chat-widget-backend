import { Server } from "socket.io";
import socketstate from "./socketState";
import { log } from "../utils";

export default function socketServer(httpServer: Express.Application) {
  const io = new Server(httpServer, { cors: { origin: "*" } });

  io.on("connection", (socket) => {
    log.info(`Socket connected: ${socket.id}`);
    socketstate.registerClient(socket);
    socket.on("disconnect", () => {
      log.info(`Socket disconnected: ${socket.id}`);
      // remove client
      socketstate.removeClient(socket);
    });

    socket.on("message", (message) => {
      log.info(message);
      socketstate.handleMsg(socket, message);
    });
  });
  return io;
}

import express from "express";
import cors from "cors";

function expressServer() {
  const app = express();

  const corsOptions = {
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  };

  app.use(cors(corsOptions));

  app.use(express.json());

  app.use(express.urlencoded({ extended: false }));

  app.get("/api/health", (req, res) => {
    res.status(200);
    res.send({
      time: new Date(),
      server: "Chat Widget Backend",
      status: "Active",
    });
  });

  return app;
}

export default expressServer;

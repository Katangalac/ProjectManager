import express from "express";
import http from "http";
import https from "https";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import googleAuthRoutes from "./routes/googleAuth.routes";
import teamRoutes from "./routes/team.routes";
import projectRoutes from "./routes/project.routes";
import taskRoutes from "./routes/task.routes";
import notificationRoutes from "./routes/notification.routes";
import conversationRoutes from "./routes/conversation.routes";
import messageRoutes from "./routes/message.routes";
import invitationsRoutes from "./routes/invitation.routes";
import { setupSocket } from "./lib/socket/socket";
import morgan from "morgan";

//store temporaire pour les codes internes
export const authCodes = new Map<string, string>();

export function startServer() {
  const app = express();
  const server = http.createServer(app);
  const PORT = process.env.PORT || 3000;
  const corsOption = {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  };

  app.use(express.json());

  //Cookie parsing
  app.use(cookieParser());
  //Logger
  app.use(morgan("dev")); //Logs en format dev des requêtes reçues

  //Les cors pour la communication avec des sytèmes externes
  app.use(cors(corsOption));

  //Body parsing
  app.use(bodyParser.json()); //Pour JSON
  app.use(bodyParser.urlencoded({ extended: true })); //Pour les formulaires

  app.set("trust proxy", 1);

  //Routes
  app.get("/", (req, res) => {
    res.json({
      message: "Bienvenue sur l'API de ProjectManager",
      status: "OK",
      timestamp: new Date().toISOString(),
      version: "v1.0.0",
    });
  });

  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1/auth", googleAuthRoutes);
  app.use("/api/v1/users", userRoutes);
  app.use("/api/v1/teams", teamRoutes);
  app.use("/api/v1/projects", projectRoutes);
  app.use("/api/v1/tasks", taskRoutes);
  app.use("/api/v1/notifications", notificationRoutes);
  app.use("/api/v1/conversations", conversationRoutes);
  app.use("/api/v1/messages", messageRoutes);
  app.use("/api/v1/invitations", invitationsRoutes);

  setupSocket(server);

  server.listen(PORT, () => console.log("Serveur démarré au port " + PORT));

  return server;
}

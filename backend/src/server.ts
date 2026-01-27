import express from "express";
import http from "http";
import https from "https";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoutes from "./user/user.routes";
import authRoutes from "./auth/auth.routes";
import googleAuthRoutes from "./auth/googleAuth/googleAuth.routes";
import teamRoutes from "./team/team.routes";
import projectRoutes from "./project/project.routes";
import taskRoutes from "./task/task.routes";
import notificationRoutes from "./notification/notification.routes";
import conversationRoutes from "./conversation/conversation.routes";
import messageRoutes from "./message/message.routes";
import invitationsRoutes from "./invitation/invitation.routes";
import emailRoutes from "./email/email.routes";
import { isAuthenticated } from "./auth/auth.middleware";
import { setupSocket } from "./socket/socket";
import morgan from "morgan";

const app = express();
const PORT = process.env.PORT || 3000;
const corsOption = {
  origin: process.env.CLIENT_URL||"http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH","OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  exposedHeaders: ['Set-Cookie'],
};

app.use(express.json());

//Cookie parsing
app.use(cookieParser());
//Logger
//app.use(morgan("dev")); //Logs en format dev des requêtes reçues

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

app.use((req, res, next) => {
  const origin = req.headers.origin||"http://localhost:3000";

  // Autoriser seulement votre frontend
  if (origin === process.env.CLIENT_URL) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization,Cookie');
    res.setHeader('Access-Control-Expose-Headers', 'Set-Cookie');
  }

  // Répondre aux requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
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
app.use((req, res, next) => {
  console.log("Cookie brut:", req.headers.cookie);
  console.log("Cookies parsés:", req.cookies);
  next();
});

//store temporaire pour les codes internes
export const authCodes = new Map<string,string>();


//Serveur pour faire du temps réel
const server = http.createServer(app);
setupSocket(server);

server.listen(PORT, () =>
  console.log("Serveur démarré sur http://localhost:3000"),
);

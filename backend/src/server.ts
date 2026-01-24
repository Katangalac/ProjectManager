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
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
};

app.use(express.json());

//Logger
//app.use(morgan("dev")); //Logs en format dev des requêtes reçues

//Les cors pour la communication avec des sytèmes externes
app.use(cors(corsOption));

//Body parsing
app.use(bodyParser.json()); //Pour JSON
app.use(bodyParser.urlencoded({ extended: true })); //Pour les formulaires

//Cookie parsing
app.use(cookieParser());

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
app.use((req, res, next) => {
  console.log("Cookie brut:", req.headers.cookie);
  console.log("Cookies parsés:", req.cookies);
  next();
});


//Serveur pour faire du temps réel
const server = http.createServer(app);
setupSocket(server);

server.listen(PORT, () =>
  console.log("Serveur démarré sur http://localhost:3000"),
);

import express from "express";
import http from "http";
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
import { isAuthenticated } from "./auth/auth.middleware";
import { setupSocket } from "./chat/chat.socket";
import morgan from "morgan";
import * as emailService from "../src/utils/email";

const app = express();
const PORT = process.env.PORT || 3000;
const corsOption = {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(express.json());

//Logger
app.use(morgan("dev")); //Logs en format dev des requêtes reçues

//Les cors pour la communication avec des sytèmes externes
app.use(cors(corsOption));

//Body parsing
app.use(bodyParser.json()); //Pour JSON
app.use(bodyParser.urlencoded({ extended: true })); //Pour les formulaires

//Cookie parsing
app.use(cookieParser());

//Routes
app.get("/", (req, res) => {
    res.json({
        message: "Bienvenue sur l'API de ProjectManager",
        status: "OK",
        timestamp: new Date().toISOString(),
        version: "v1.0.0",
    })
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

app.post("/api/v1/welcomeEmail", async (req, res) => {
    try {
        const { to, name } = req.body;
        await emailService.sendWelcomeEmail(to, name);
        res.status(200).json({message:"Email envoyé"});
    } catch (err) {
        console.error("Erreur lors de l'envoie de l'email", err);
        res.status(500).json({error:"Erreur lors de l'envoie de l'email"});
    }
});

//TODO:Interaction entre service
//TODO:Déterminer les routes à exposer à l'API X
//TODO:Corriger le createdAt qui change à chaque fois X
//TODO:Parachever les routes pour un user connnecté, routes "me" X
//TODO:Revoir le decoupage/architecture X
//TODO:Ajouter les informations de paginations comme retour des requetes X
//TODO:Ajouter la route patch auth/password X
//TODO:Determiner si oui ou non ajouter les routes du profile utilisateur
//TODO:Mécanisme de mot de passe oublié
//TODO:Mettre en place le service d'envoi d'email

//Serveur pour faire du temps réel
const server = http.createServer(app);
setupSocket(server);

app.listen(PORT, () => console.log("Serveur démarré sur http://localhost:3000"));
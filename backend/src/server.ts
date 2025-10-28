import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import userRoutes from "./user/routes/user.routes"
import authRoutes from "./auth/routes/auth.routes"
import { authenticate } from "./auth/middleware/authenticate";
import morgan from "morgan"

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
        version:"v1.0.0",
    })
})
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

app.listen(PORT, () => console.log("Serveur démarré sur http://localhost:3000"));
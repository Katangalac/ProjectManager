import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;
const corsOption = {
    origin: 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(express.json());
app.use(cors(corsOption));

app.get('/', (req,res) => res.send('Bienvenue au backend de ProjectManager!'));

app.listen(PORT, () => console.log('Serveur démarré sur http://localhost:3000'));
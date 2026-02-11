import express from 'express';
import connectionDB from './config/db';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes.js';
import passwordRoutes from './routes/passwordRoutes.js'

await connectionDB();
const app = express();

// ecoute a front s'il envoi les requets
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());

// app utilise tous les routages pour login et authentication
app.use("/auth", authRoutes); 

// app utilise tous les routages pour passwords et l'enregisterement
app.use("/dashboard", passwordRoutes);




const PORT = 3000;

app.listen(PORT, ()=> {
    console.log(`Notre server est lancer sur le port http://localhost:${PORT}`);
})


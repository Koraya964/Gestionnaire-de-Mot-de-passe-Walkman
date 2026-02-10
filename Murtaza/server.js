import express from 'express';
import connectionDB from './config/db';
import routeLoginRegister from './routes/authRoutes.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';

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

app.use(routeLoginRegister)

// page d'accueil
app.get('/', async(req, res) => {
    try{
        console.log("C'est le page d'accuiel");
        // req.body({message: "c'est le pass d'accuiel"});
    }catch(err){
        console.log(err)
    }
});


// page de enrigistrer d'un utilisateur ou form d'enrigistrement
app.get('/register', async(req, res) => {
    try{
        console.log(`C'est le page de register pour afficher les donnees`);
    }catch(error){
        console.log(error);
    }
})



// page de login
app.get('/login', async(req, res) => {
    try{
        console.log("Page de login pour afficher les donnees")
    }catch(error){
        console.log(error)
    }
});


// page de dashboard
app.get('/dashboard', async(req, res) => {
    try{
        console.log("Page de dashboard");
    }catch(error){
        console.log(error);
    }
});

// route de loging out
app.get('/logout', async(req, res) => {
    try{
        console.log("Page de logout");
    }catch(error){
        console.log(error)
    }
});


const PORT = 3000;

app.listen(PORT, ()=> {
    console.log(`Notre server est lancer sur le port http://localhost:${PORT}`);
})


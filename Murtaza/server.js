import express from 'express';


const app = express();
app.use(express.json())

app.get('/', async(req, res) => {
    try{
        console.log("C'est le page d'accuiel");
        // req.body({message: "c'est le pass d'accuiel"});
    }catch(err){
        console.log(err)
    }
});

app.get('/register', async(req, res) => {
    try{
        console.log(`C'est le page de register pour afficher les donnees`);
    }catch(error){
        console.log(error);
    }
})

app.post('/register', async(req, res) => {
    try{
        // ici on requpere la donnee de req.body
        console.log("cest le page de resgister pour poster des donnees")
    }catch(error){
        console.log(error);
    }
})

app.get('/login', async(req, res) => {
    try{
        console.log("Page de login pour afficher les donnees")
    }catch(error){
        console.log(error)
    }
});

app.post('/login', async(req, res) => {
    try{
        console.log("Page de login pour requperer les donnees de login");
    }catch(error){
        console.log(error);
    }
})

app.get('/dashboard', async(req, res) => {
    try{
        console.log("Page de dashboard");
    }catch(error){
        console.log(error);
    }
});

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


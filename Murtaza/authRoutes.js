import express from 'express';
import { registerOneUser } from './controlers/authControler';
import { authenticateUser } from './controlers/authControler';
import { logout } from './controlers/authControler';

const router = express.Router();

//route pour enrigisterer un nouveau utilisateur
router.post('/register', registerOneUser); 

// route pour login chaque utilisateur
router.post('/login', authenticateUser);

//route pour logingout 
router.get('/logout', logout);

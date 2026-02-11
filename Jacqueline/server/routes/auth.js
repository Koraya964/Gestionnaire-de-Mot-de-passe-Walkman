import express from 'express';
import AuthController from '../controllers/AuthController.js';

const router = express.Router();

// Routes d'authentification - délèguent au controller
router.post('/register', (req, res) => AuthController.register(req, res));
router.post('/login', (req, res) => AuthController.login(req, res));
router.post('/dashboard', (req, res) => AuthController.login(req, res));

export default router;

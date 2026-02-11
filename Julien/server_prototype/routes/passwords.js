import express from 'express';
import PasswordController from '../controllers/PasswordController.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent d'être connecté
router.use(authMiddleware);

// Routes CRUD - délèguent au controller
router.post('/', (req, res) => PasswordController.create(req, res));
router.get('/', (req, res) => PasswordController.getAll(req, res));
router.post('/:id/decrypt', (req, res) => PasswordController.decrypt(req, res));
router.put('/:id', (req, res) => PasswordController.update(req, res));
router.delete('/:id', (req, res) => PasswordController.delete(req, res));

export default router;

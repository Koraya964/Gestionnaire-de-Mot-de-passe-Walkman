import express from 'express';
import Password from '../../Murtaza/models/Password.js';
import User from '../../Murtaza/models/User.js';
import CryptoService from '../services/cryptoService.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Toutes les routes nécessitent d'être connecté
router.use(authMiddleware);

// Créer un nouveau mot de passe
router.post('/', async (req, res) => {
    try {
        const { title, website, username, password, masterPassword } = req.body;
        const user = await User.findById(req.userId);

        // Check du master password
        if (!await user.verifyMasterPassword(masterPassword)) {
            return res.status(401).json({ error: 'Master password incorrect' });
        }

        // Je récupère la clé de chiffrement
        const key = await user.getEncryptionKey(masterPassword);

        // Je chiffre le mot de passe avec AES-256-GCM
        const { encrypted, iv, authTag } = CryptoService.encrypt(password, key);

        // Je stocke tout en base
        const newPassword = await Password.create({
            userId: user._id,
            title,
            website,
            username,
            encryptedPassword: encrypted,  // Password chiffré
            iv,                            // IV unique pour ce password
            authTag                        // Tag d'authentification GCM
        });

        res.status(201).json({ success: true, password: newPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Récupérer tous mes mots de passe (chiffrés)
router.get('/', async (req, res) => {
    try {
        const passwords = await Password.find({ userId: req.userId })
            .sort({ createdAt: -1 });

        res.json({ success: true, passwords });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Déchiffrer un mot de passe spécifique
router.post('/:id/decrypt', async (req, res) => {
    try {
        const { masterPassword } = req.body;

        const user = await User.findById(req.userId);
        const password = await Password.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!password) {
            return res.status(404).json({ error: 'Password pas trouvé' });
        }

        // Re-check du master password avant de déchiffrer
        if (!await user.verifyMasterPassword(masterPassword)) {
            return res.status(401).json({ error: 'Master password incorrect' });
        }

        // Je récupère la clé et je déchiffre
        const key = await user.getEncryptionKey(masterPassword);
        const decrypted = CryptoService.decrypt(
            password.encryptedPassword,
            key,
            password.iv,       // Même IV utilisé pour chiffrer
            password.authTag   // Tag pour vérifier l'intégrité
        );

        res.json({ success: true, password: decrypted });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Modifier un mot de passe existant
router.put('/:id', async (req, res) => {
    try {
        const { title, website, username, password: newPassword, masterPassword } = req.body;

        const passwordEntry = await Password.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!passwordEntry) {
            return res.status(404).json({ error: 'Password pas trouvé' });
        }

        // Si je modifie le password lui-même, je dois le rechiffrer
        if (newPassword) {
            const user = await User.findById(req.userId);

            if (!await user.verifyMasterPassword(masterPassword)) {
                return res.status(401).json({ error: 'Master password incorrect' });
            }

            // Je rechiffre avec un nouvel IV
            const key = await user.getEncryptionKey(masterPassword);
            const { encrypted, iv, authTag } = CryptoService.encrypt(newPassword, key);

            passwordEntry.encryptedPassword = encrypted;
            passwordEntry.iv = iv;           // Nouvel IV
            passwordEntry.authTag = authTag; // Nouveau tag
        }

        // Update des métadonnées (pas besoin de rechiffrer)
        if (title) passwordEntry.title = title;
        if (website) passwordEntry.website = website;
        if (username) passwordEntry.username = username;

        await passwordEntry.save();

        res.json({ success: true, password: passwordEntry });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Supprimer un mot de passe
router.delete('/:id', async (req, res) => {
    try {
        const password = await Password.findOneAndDelete({
            _id: req.params.id,
            userId: req.userId
        });

        if (!password) {
            return res.status(404).json({ error: 'Password pas trouvé' });
        }

        res.json({ success: true, message: 'Password supprimé' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

export default router;
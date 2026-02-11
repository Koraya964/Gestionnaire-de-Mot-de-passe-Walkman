import Password from '../models/Password.js';
import User from '../models/User.js';
import CryptoService from '../services/cryptoService.js';

class PasswordController {
    // Controller pour créer un nouveau mot de passe
    async create(req, res) {
        try {
            const { titre, site, userName, email, password, category, masterPassword } = req.body;
            const user = await User.findById(req.userId);

            // Check du master password
            if (!await user.verifyPassword(masterPassword)) {
                return res.status(401).json({ error: 'Master password incorrect' });
            }

            // Je récupère la clé de chiffrement
            const key = await user.getEncryptionKey(masterPassword);

            // Je chiffre le mot de passe avec AES-256-GCM préalablement fait dans CryptoService
            const { encrypted, iv, authTag } = CryptoService.encrypt(password, key);

            // Je stocke tout en base
            const newPassword = await Password.create({
                userId: user._id,
                titre,
                site,
                userName,
                email,
                category: category || 'other',
                encryptedPassword: encrypted,  // Password chiffré
                iv,                            // IV unique pour ce password
                authTag                        // Tag d'authentification GCM
            });

            res.status(201).json({ success: true, password: newPassword });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Controller pour lister tous les mots de passe
    async getAll(req, res) {
        try {
            const { category } = req.query;

            const filter = { userId: req.userId };
            if (category && category !== 'all') {
                filter.category = category;
            }

            const passwords = await Password.find(filter)
                .sort({ createdAt: -1 });

            res.json({ success: true, passwords });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Controller pour déchiffrer un mot de passe spécifique
    async decrypt(req, res) {
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
            if (!await user.verifyPassword(masterPassword)) {
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
    }

    // Controller pour modifier un mot de passe
    async update(req, res) {
        try {
            const { titre, site, userName, email, category, password: newPassword, masterPassword } = req.body;

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

                if (!await user.verifyPassword(masterPassword)) {
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
            if (titre) passwordEntry.titre = titre;
            if (site) passwordEntry.site = site;
            if (userName !== undefined) passwordEntry.userName = userName;
            if (email !== undefined) passwordEntry.email = email;
            if (category) passwordEntry.category = category;

            await passwordEntry.save();

            res.json({ success: true, password: passwordEntry });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Controller pour supprimer un mot de passe
    async delete(req, res) {
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
    }
}

export default new PasswordController();

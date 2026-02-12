import User from '../models/User.js';
import Password from '../models/Password.js';
import CryptoService from '../services/cryptoService.js';
import EmailService from '../services/emailService.js';
import crypto from 'crypto';
import { generateToken } from '../middleware/auth.js';

class AuthController {
    // Controller pour l'inscription
    async register(req, res) {
        try {
            const { firstName, lastName, email, telephone, password } = req.body;

            // Je vérifie si l'email existe déjà
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email déjà  utilisé' });
            }

            // Je génère un salt unique pour dériver la clef de chiffrement
            const encryptionSalt = CryptoService.generateSalt();

            // Je crée l'utilisateur (le password sera hashé par le pre-save hook)
            const user = await User.create({
                firstName,
                lastName,
                email,
                telephone,
                password,  // Sera hashé automatiquement
                encryptionSalt
            });

            // Setup recovery key
            const recoveryKey = user.setupRecovery(password);
            await user.save();

            // Je génère le JWT
            const token = generateToken(user._id);

            // Envoie l'email de bienvenue (async, non-bloquant)
            EmailService.sendWelcomeEmail(user.email, user.firstName, recoveryKey);

            res.status(201).json({
                success: true,
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                },
                recoveryKey // à afficher une fois à  l'utilisateur
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Controller pour la connexion
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Je cherche l'utilisateur
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            // Je vérifie le password
            const isValid = await user.verifyPassword(password);
            if (!isValid) {
                return res.status(401).json({ error: 'Email ou mot de passe incorrect' });
            }

            // Je génère le JWT
            const token = generateToken(user._id);

            res.json({
                success: true,
                token,
                user: {
                    id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email
                }
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    // Reset password avec recovery key
    async resetPasswordWithRecovery(req, res) {
        try {
            const { email, recoveryKey, newPassword } = req.body;


            // Trouve l'utilisateur
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ error: 'Utilisateur non trouvé' });
            }

            // Vérifie que la recovery est setup
            if (!user.encryptedMasterKey || !user.recoveryKeySalt || !user.recoveryKeyIV) {
                return res.status(400).json({ error: 'Recovery key non configuré' });
            }

            try {
                // DÃ©rive la clé depuis la recovery key
                const recoveryDerivedKey = crypto.pbkdf2Sync(
                    recoveryKey,
                    user.recoveryKeySalt,
                    100000,
                    32,
                    'sha256'
                );

                // Déchiffre la clé principale
                const [encrypted, authTag] = user.encryptedMasterKey.split(':');
                const iv = Buffer.from(user.recoveryKeyIV, 'hex');

                const decipher = crypto.createDecipheriv('aes-256-gcm', recoveryDerivedKey, iv);
                decipher.setAuthTag(Buffer.from(authTag, 'hex'));

                let masterKeyHex = decipher.update(encrypted, 'hex', 'utf8');
                masterKeyHex += decipher.final('utf8');
                const oldMasterKey = Buffer.from(masterKeyHex, 'hex');

                // Dérive la NOUVELLE clé depuis le nouveau password
                const newSalt = CryptoService.generateSalt();
                const newMasterKey = crypto.pbkdf2Sync(newPassword, newSalt, 100000, 32, 'sha256');

                // Re-chiffrer TOUS les passwords
                const passwords = await Password.find({ userId: user._id });

                for (const pwd of passwords) {
                    // Déchiffre avec l'ancienne clé
                    const decrypted = CryptoService.decrypt(
                        pwd.encryptedPassword,
                        oldMasterKey,
                        pwd.iv,
                        pwd.authTag
                    );

                    // Re-chiffre avec la nouvelle clé
                    const { encrypted, iv, authTag } = CryptoService.encrypt(decrypted, newMasterKey);

                    pwd.encryptedPassword = encrypted;
                    pwd.iv = iv;
                    pwd.authTag = authTag;
                    await pwd.save();
                }

                // Update le user
                user.password = newPassword; // Auto-hashé par pre-save
                user.encryptionSalt = newSalt;

                // Re-setup recovery avec le nouveau password
                const newRecoveryKey = user.setupRecovery(newPassword);
                await user.save();

                // Envoie email de confirmation
                EmailService.sendPasswordResetConfirmation(user.email, user.firstName);

                res.json({
                    success: true,
                    message: 'Mot de passe réinitialisé',
                    newRecoveryKey // Nouvelle recovery key Ã  sauvegarder
                });

            } catch (error) {
                return res.status(401).json({ error: 'Recovery key invalide' });
            }

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }
}

export default new AuthController();
import User from '../models/User.js';
import CryptoService from '../services/cryptoService.js';
import { generateToken } from '../middleware/auth.js';

class AuthController {
    // Controller pour l'inscription
    async register(req, res) {
        try {
            const { firstName, lastName, email, telephone, password } = req.body;

            // Je vérifie si l'email existe déjà
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ error: 'Email déjà utilisé' });
            }

            // Je génère un salt unique pour dériver la clé de chiffrement
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

            // Je génère le JWT
            const token = generateToken(user._id);

            res.status(201).json({ // je sais pas si c'est un bon tokken j'ai pris l'info sur reddit mais c'est peut-être bof
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
}

export default new AuthController();

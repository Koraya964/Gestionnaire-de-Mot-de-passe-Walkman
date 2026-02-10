// middleware/auth.js
import jwt from 'jsonwebtoken';

// Middleware pour vérifier le JWT
export const authMiddleware = (req, res, next) => {
    try {
        // Je récupère le token du header Authorization
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Token manquant' });
        }

        // J'extrais le token (enlever "Bearer ")
        const token = authHeader.split(' ')[1];

        // Je vérifie et décode le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // J'ajoute l'userId à la requête pour les routes suivantes
        req.userId = decoded.userId;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expiré' });
        }
        return res.status(401).json({ error: 'Token invalide' });
    }
};

// Générer un JWT lors de la connexion
export const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }  // Token valide 24h
    );
};
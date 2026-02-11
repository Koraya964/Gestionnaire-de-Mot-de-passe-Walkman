import jwt from "jsonwebtoken";

// protectect chaque root afin de vérifier si le token à été bien existé
export const authMiddleware = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token manquant" });
        }

        const token = authHeader.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: "Token invalide ou expiré" });
    }
};

// generate un token afin de login et pass l'id d'utilisateur qui login
export const generateToken = (userId) => {
    return jwt.sign(
        { userId },
        process.env.JWT_SECRET,
        { expiresIn: "24h" }
    );
};

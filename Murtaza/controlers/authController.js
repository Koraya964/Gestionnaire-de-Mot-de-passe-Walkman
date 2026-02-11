import argon2 from "argon2";
import User from "../models/User.js";
import { generateToken } from "../middleware/authMiddleware.js";

// création un nouveau utilisateur
export const registerOneUser = async (req, res) => {
    try {
        const exists = await User.findOne({ email: req.body.email });
        if (exists) {
            return res.status(401).json({ message: "Un utilisateur avec cet email existe déjà" });
        }

        const newUser = new User(req.body);
        await newUser.save();

        res.status(201).json({ success: true, user: newUser });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

// authenticate chaque user en temps de login
export const authenticateUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: "Email ou mot de passe incorrect" });

        const match = await argon2.verify(user.password, password);
        if (!match) return res.status(401).json({ message: "Email ou mot de passe incorrect" });

        const token = generateToken(user._id);

        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur" });
    }
};

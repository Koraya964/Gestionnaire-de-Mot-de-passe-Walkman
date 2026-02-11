import Password from "../models/Password.js";
import User from "../models/User.js";
import CryptoService from "../services/cryptoService.js";

// enregisterement d'un mot de pass avec ses propriétés
export const registerPassword = async (req, res) => {
    try {
        const { title, website, email, userName, category, password, masterPassword } = req.body;

        const user = await User.findById(req.userId);

        // Vérifier le master password
        if (!await user.verifyMasterPassword(masterPassword)) {
            return res.status(401).json({ error: "Master password incorrect" });
        }

        // Générer la clé AES
        const key = await user.getEncryptionKey(masterPassword);

        // Chiffrer le password
        const { encrypted, iv, authTag } = CryptoService.encrypt(password, key);

        // Enregistrer dans la base
        const newPassword = await Password.create({
            userId: req.userId,
            title,
            website,
            email,
            userName,
            category,
            encryptedPassword: encrypted,
            iv,
            authTag
        });

        res.status(201).json({ success: true, password: newPassword });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// récuperer tous les mots de pass pour chaque utilisateur qui est déja login
export const getAllPasswords = async (req, res) => {
    try {
        const passwords = await Password.find({ userId: req.userId }).sort({ createdAt: -1 });
        res.json({ success: true, passwords });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// récupere chaque mot de pass d'utilisateur qui est déja login
export const getOnePassword = async (req, res) => {
    try {
        const password = await Password.findOne({
            _id: req.params.id,
            userId: req.userId
        });

        if (!password) {
            return res.status(404).json({ error: "Mot de passe introuvable" });
        }

        res.json({ success: true, password });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// services/cryptoService.js
import crypto from 'crypto';

class CryptoService {
    // Chiffrer des données avec AES-256-GCM
    static encrypt(plaintext, key) {
        // Je génère un IV unique pour ce chiffrement
        const iv = crypto.randomBytes(12);

        // Je crée le cipher avec l'algo AES-256-GCM
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

        // Je chiffre le texte
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Je récupère le tag d'authentification
        const authTag = cipher.getAuthTag();

        // Je retourne tout ce dont j'ai besoin pour déchiffrer plus tard
        return {
            encrypted: encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    // Déchiffrer des données
    static decrypt(encrypted, key, iv, authTag) {
        // Je crée le decipher
        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            key,
            Buffer.from(iv, 'hex')  // Je réutilise le même IV grace au return plus haut 
        );

        // Je définis le tag pour vérifier l'intégrité
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        // Je déchiffre
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    // Dériver une clé de chiffrement depuis le master password
    static deriveKey(masterPassword, salt) {
        // J'utilise PBKDF2 pour dériver une clé de 32 bytes (256 bits)(infos trouvée sur reddit/stackoverflow)
        return crypto.pbkdf2Sync(
            masterPassword,
            salt,
            100000,  // 100k itérations
            32,      // 32 bytes = 256 bits pour AES-256
            'sha256'
        );
    }

    // Générer un salt aléatoire
    static generateSalt() {
        return crypto.randomBytes(32).toString('hex');
    }
}

export default CryptoService;
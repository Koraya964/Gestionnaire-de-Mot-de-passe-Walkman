// services/cryptoService.js
import crypto from 'crypto';

class CryptoService {
    // Chiffrer des données avec AES-256-GCM
    static encrypt(plaintext, key) {
        // IV = 12 bytes recommandé pour AES-GCM
        const iv = crypto.randomBytes(12);

        // Création du cipher AES-256-GCM
        const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);

        // Chiffrement
        let encrypted = cipher.update(plaintext, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        // Tag d’authentification (intégrité)
        const authTag = cipher.getAuthTag();

        return {
            encrypted,
            iv: iv.toString('hex'),
            authTag: authTag.toString('hex')
        };
    }

    // Déchiffrer des données AES-256-GCM
    static decrypt(encrypted, key, iv, authTag) {
        const decipher = crypto.createDecipheriv(
            'aes-256-gcm',
            key,
            Buffer.from(iv, 'hex')
        );

        // Vérification d’intégrité
        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        // Déchiffrement
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return decrypted;
    }

    // Dériver une clé de chiffrement depuis le master password
    static deriveKey(masterPassword, salt) {
        return crypto.pbkdf2Sync(
            masterPassword,
            salt,
            100000,  // 100k itérations
            32,      // 32 bytes = 256 bits (clé AES-256)
            'sha256'
        );
    }

    // Générer un salt aléatoire
    static generateSalt() {
        return crypto.randomBytes(32).toString('hex');
    }
}

export default CryptoService;

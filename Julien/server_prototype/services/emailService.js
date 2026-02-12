import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();


class EmailService {
    constructor() {
        // Configuration du transporteur email
        this.transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });
    }

    async sendWelcomeEmail(email, firstName, recoveryKey) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || 'WalkmanPass <noreply@walkmanpass.com>',
                to: email,
                subject: 'Bienvenue sur WalkmanPass - Votre recovery key',
                html: `
                    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                            <h1 style="color: white; margin: 0; font-size: 28px;">Bienvenue ${firstName} !</h1>
                        </div>
                        
                        <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
                            <h2 style="color: #1f2937; margin-top: 0; font-size: 18px;">Votre compte a été créé avec succès</h2>
                            <p style="color: #4b5563; line-height: 1.6; margin-bottom: 0;">
                                Vous pouvez maintenant stocker vos mots de passe en toute sécurité avec WalkmanPass.
                            </p>
                        </div>
                        
                        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                            <h3 style="color: #991b1b; margin-top: 0; font-size: 16px; font-weight: 600;">IMPORTANT - Recovery Key</h3>
                            <p style="color: #7f1d1d; margin-bottom: 15px; line-height: 1.6;">
                                Votre <strong>recovery key</strong> vous permettra de récupérer votre compte si vous oubliez votre master password. 
                                <strong>Conservez-la précieusement !</strong>
                            </p>
                            <div style="background: white; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 13px; word-break: break-all; color: #1f2937; font-weight: 600;">
                                ${recoveryKey}
                            </div>
                        </div>
                        
                        <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                            <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
                                <strong>Conseil :</strong> Notez cette recovery key sur papier ou dans un gestionnaire de mots de passe secondaire. 
                                Sans elle, vos données seront <strong>irrécupérables</strong> en cas d'oubli du master password.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.CLIENT_URL}/dashboard" 
                                style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                                Accéder à mon coffre
                            </a>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        
                        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                            WalkmanPass - Architecture Zero-Knowledge<br>
                            Vos données sont chiffrées localement, nous ne pouvons jamais y accéder.
                        </p>
                    </div>
                `
            });
            console.log('Email de bienvenue envoyé à:', email);
        } catch (error) {
            console.error('Erreur envoi email:', error);
            // On ne bloque pas l'inscription si l'email échoue
        }
    }

    async sendPasswordResetConfirmation(email, firstName) {
        try {
            await this.transporter.sendMail({
                from: process.env.EMAIL_FROM || 'WalkmanPass <noreply@walkmanpass.com>',
                to: email,
                subject: 'Confirmation - Mot de passe réinitialisé',
                html: `
                    <div style="font-family: 'Inter', -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
                            <h1 style="color: white; margin: 0; font-size: 24px;">Mot de passe réinitialisé</h1>
                        </div>
                        
                        <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                            <p style="color: #065f46; margin: 0; line-height: 1.6;">
                                Bonjour ${firstName},<br><br>
                                Votre master password a été réinitialisé avec succès. Tous vos mots de passe stockés ont été automatiquement re-chiffrés avec votre nouveau master password.
                            </p>
                        </div>

                        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                            <h3 style="color: #991b1b; margin-top: 0; font-size: 16px; font-weight: 600;">IMPORTANT - Recovery Key</h3>
                            <p style="color: #7f1d1d; margin-bottom: 15px; line-height: 1.6;">
                                Votre <strong>recovery key</strong> vous permettra de récupérer votre compte si vous oubliez votre master password. 
                                <strong>Conservez-la précieusement !</strong>
                            </p>
                            <div style="background: white; padding: 15px; border-radius: 6px; font-family: monospace; font-size: 13px; word-break: break-all; color: #1f2937; font-weight: 600;">
                                ${recoveryKey}
                            </div>
                        </div>
                        
                        <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                            <p style="color: #7f1d1d; margin: 0; line-height: 1.6; font-size: 14px;">
                                <strong>Sécurité :</strong> Si vous n'êtes pas à l'origine de cette action, contactez-nous immédiatement.
                            </p>
                        </div>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.CLIENT_URL}/login" 
                                style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px;">
                                Se connecter
                            </a>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        
                        <p style="color: #9ca3af; font-size: 12px; text-align: center; margin: 0;">
                            WalkmanPass - Architecture Zero-Knowledge
                        </p>
                    </div>
                `
            });
            console.log('Email de confirmation envoyé à:', email);
        } catch (error) {
            console.error('Erreur envoi email:', error);
        }
    }
}

export default new EmailService();

import axios from 'axios';

export class EmailService {
    // L'URL de ton API Enerlog extraite du code Laravel
    private static API_URL = process.env.API_URL_SENDEMAIL || 'https://cpay.enerlog.net/message/send/mail';
    private static APP_NAME = process.env.APP_NAME || 'Compositor';

    /**
     * Envoie le code de vérification en utilisant l'API Enerlog
     */
    static async sendVerificationCode(toEmail: string, code: string): Promise<boolean> {
        const htmlContent = this.getTemplate(this.APP_NAME, code);

        // Préparation du payload comme dans ton code Laravel
        const payload = {
            subject: `Code de vérification - ${this.APP_NAME}`,
            body: htmlContent, // Le contenu HTML généré plus bas
            fromEmail: "no-reply@enerlog.net",
            fromName: `${this.APP_NAME} Bot`,
            toEmail: toEmail,
            toName: "Utilisateur Compositor"
        };

        try {
            // Appel API (Http::withoutVerifying() en Laravel = httpsAgent avec rejectUnauthorized: false en Node)
            const response = await axios.post(this.API_URL, payload);

            // Vérification du succès (response.successful() en Laravel)
            if (response.status >= 200 && response.status < 300) {
                return true;
            } else {
                console.error(`Erreur API Enerlog (Status: ${response.status})`);
                return false;
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error("Erreur lors de l'envoi de l'email via API:", error.response?.data || error.message);
            }
            return false;
        }
    }

    /**
     * Template HTML (Design simple et pro)
     */
    private static getTemplate(appName: string, code: string): string {
        return `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden;">
            <div style="background: #312782; padding: 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${appName}</h1>
            </div>
            <div style="padding: 40px 20px; text-align: center; background: #ffffff;">
                <p style="font-size: 16px; color: #495057;">Veuillez saisir le code envoyé pour confirmer votre email :</p>
                <div style="background-color: #f8f9fa; border: 2px dashed #312782; padding: 20px; margin: 25px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #312782; border-radius: 8px;">
                    ${code}
                </div>
                <p style="font-size: 14px; color: #6c757d;">Ce code expirera dans 10 minutes par mesure de sécurité.</p>
            </div>
            <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                <p style="margin: 0; color: #6c757d; font-size: 12px;">
                    © ${new Date().getFullYear()} ${appName}. Tous droits réservés.
                </p>
            </div>
        </div>`;
    }



    // Génère un code à 6 chiffres    
    static generateOTP(): string {
        // genreration du code à 6 chiffres
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    // Calcule la date d'expiration
    static getExpirationDate(minutes: number): Date {
        return new Date(Date.now() + minutes * 60 * 1000);
    }

}

import axios from 'axios';
import TemplateEnvoieEmail from '../Utils/TemplateEnvoieEmail.ts';

export class EmailService {
    // L'URL de ton API Enerlog extraite du code Laravel
    private static API_URL = process.env.API_URL_SENDEMAIL || 'https://cpay.enerlog.net/message/send/mail';
    private static APP_NAME = process.env.APP_NAME || 'Compositor';
    private static BASE_URL= process.env.APP_URL || "http://localhost:3000/" ;
    private static LOGIN_URL= process.env.URL_LOGIN_FRONT || "http://localhost:5173/site/admin/auth/login" ;

    /**
     * Envoie le code de vérification en utilisant l'API Enerlog
     */
    static async sendVerificationCode(toEmail: string, code: string): Promise<boolean> {
        const htmlContent = TemplateEnvoieEmail.getTemplateEnvoiCode(this.APP_NAME, code);

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


    static async sendVerificationEmail(toEmail: string, confirmationToken: string): Promise<boolean> {
        const htmlContent = TemplateEnvoieEmail.getTemplateVerifyEmail(this.APP_NAME, this.BASE_URL, confirmationToken, toEmail);

        // Préparation du payload comme dans ton code Laravel
        const payload = {
            subject: `Confirmation de votre compte - ${this.APP_NAME}`,
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


    static async sendWelcome(toEmail: string,tempPassword: string,): Promise<boolean> {
        const htmlContent = TemplateEnvoieEmail.getTemplateWelcome(this.APP_NAME, tempPassword,toEmail,this.LOGIN_URL);

        // Préparation du payload comme dans ton code Laravel
        const payload = {
            subject: `Bienvenue sur ${this.APP_NAME}`,
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
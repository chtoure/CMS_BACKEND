import axios from 'axios';

export class MailboxLayerService {
    // Ta clé API gratuite récupérée sur le tableau de bord MailboxLayer
    private static API_KEY =  process.env.API_KEY_VERIFY_EMAIL || 'a62e3ee797602742473381531837016c';
    private static BASE_URL = process.env.BASE_URL_VERIFY_EMAIL || 'http://apilayer.net/api/check';

    /**
     * Vérifie si l'email existe réellement
     */
    static async checkExistence(email: string): Promise<{ success: boolean; message: string }> {
        try {
            const response = await axios.get(this.BASE_URL, {
                params: {
                    access_key: this.API_KEY,
                    email: email,
                    smtp: 1, // Très important : active la vérification réelle du compte
                    format: 1
                }
            });

            const data = response.data;

            // 1. Vérifier si l'API a renvoyé une erreur (ex: quota dépassé)
            if (data.error) {
                console.error("Erreur API MailboxLayer:", data.error.info);
                return { success: true, message: "Validation ignorée (Erreur API)" };
            }

            // 2. Logique de décision
            // format_valid: Syntaxe de l'email
            // mx_found: Le domaine a des serveurs mail
            // smtp_check: LE POINT CLÉ - Est-ce que le compte existe sur le serveur ?
            
            if (!data.format_valid) {
                return { success: false, message: "Le format de l'email est incorrect." };
            }

            if (!data.mx_found) {
                return { success: false, message: "Le domaine de cet email n'existe pas." };
            }

            if (!data.smtp_check) {
                return { success: false, message: "Cet utilisateur n'existe pas sur ce serveur mail." };
            }

            if (data.disposable) {
                return { success: false, message: "Les emails jetables ne sont pas autorisés." };
            }

            return { success: true, message: "L'email est valide et existe." };

        } catch (error) {
            console.error("Erreur lors de l'appel MailboxLayer:", error);
            // En cas de panne réseau, on laisse passer pour ne pas bloquer l'admin
            return { success: true, message: "Service de vérification indisponible, passage en mode manuel." };
        }
    }
}
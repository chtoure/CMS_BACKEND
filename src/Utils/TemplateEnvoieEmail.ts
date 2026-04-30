
export default class TemplateEnvoieEmail {
    
    /**
     * Template pour l'envoi du code de vérification
     */
    static getTemplateEnvoiCode(appName: string, code: string): string {
        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Code de v&eacute;rification</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                    <td style="background: linear-gradient(135deg, #312782 0%, #4a3fbc 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">${appName}</h1>
                    </td>
                </tr>
                
                <!-- Content -->
                <tr>
                    <td style="padding: 48px 32px; text-align: center;">
                        <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 24px; font-weight: 700;">V&eacute;rification de votre e-mail</h2>
                        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #64748b;">Veuillez saisir le code ci-dessous sur l'application pour confirmer votre adresse e-mail :</p>
                        
                        <!-- Code Box -->
                        <div style="background-color: #f1f5f9; border: 2px solid #e2e8f0; padding: 24px; border-radius: 12px; margin-bottom: 32px;">
                            <span style="font-size: 36px; font-weight: 800; letter-spacing: 12px; color: #312782; font-family: 'Courier New', Courier, monospace;">${code}</span>
                        </div>
                        
                        <p style="margin: 0; font-size: 14px; color: #94a3b8; font-style: italic;">Ce code expirera dans 10 minutes par mesure de s&eacute;curit&eacute;.</p>
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #f1f5f9;">
                        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">&copy; ${new Date().getFullYear()} ${appName}</p>
                        <p style="margin: 0; color: #94a3b8; font-size: 12px;">Ceci est un message automatique, veuillez ne pas y r&eacute;pondre.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;
    }

    /**
     * Template pour la confirmation de réception/compte (Lien)
     */
    static getTemplateVerifyEmail(appName: string, BASE_URL: string, confirmationToken: string, userEmail: string): string {
        const confirmationUrl = `${BASE_URL}confirm-receipt?token=${encodeURIComponent(confirmationToken)}&email=${encodeURIComponent(userEmail)}`;

        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Activation de compte</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                    <td style="background: linear-gradient(135deg, #312782 0%, #4a3fbc 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">${appName}</h1>
                    </td>
                </tr>
                
                <!-- Content -->
                <tr>
                    <td style="padding: 48px 32px; text-align: center;">
                        <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 24px; font-weight: 700;">Bienvenue &agrave; bord !</h2>
                        <p style="margin: 0 0 24px 0; font-size: 16px; line-height: 1.6; color: #64748b; text-align: left;">
                            Un administrateur a cr&eacute;&eacute; un compte pour vous sur <strong>${appName}</strong>.
                        </p>
                        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #64748b; text-align: left;">
                            Pour activer vos acc&egrave;s et confirmer la r&eacute;ception de ce message, cliquez sur le bouton ci-dessous :
                        </p>
                        
                        <!-- CTA Button -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center">
                                    <a href="${confirmationUrl}" target="_blank" style="display: inline-block; padding: 18px 48px; background-color: #10b981; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 12px; transition: all 0.3s ease;">
                                        Confirmer la r&eacute;ception
                                    </a>
                                </td>
                            </tr>
                        </table>
                        
                        <p style="margin: 32px 0 0 0; font-size: 13px; color: #94a3b8; text-align: center; line-height: 1.5;">
                            Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :<br>
                            <a href="${confirmationUrl}" style="color: #312782; text-decoration: none; word-break: break-all; font-weight: 500;">${confirmationUrl}</a>
                        </p>
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #f1f5f9;">
                        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">&copy; ${new Date().getFullYear()} ${appName}</p>
                        <p style="margin: 0; color: #94a3b8; font-size: 12px;">Ceci est un message automatique de s&eacute;curit&eacute;.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;
    }

    /**
     * Template de bienvenue avec identifiants temporaires
     */
    static getTemplateWelcome(appName: string, tempPassword: string, userEmail: string, loginUrl: string): string {
        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Vos identifiants de connexion</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f8fafc; color: #1e293b;">
            <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);">
                <!-- Header -->
                <tr>
                    <td style="background: linear-gradient(135deg, #312782 0%, #4a3fbc 100%); padding: 40px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 800; letter-spacing: -0.5px; text-transform: uppercase;">${appName}</h1>
                    </td>
                </tr>
                
                <!-- Content -->
                <tr>
                    <td style="padding: 48px 32px; text-align: left;">
                        <h2 style="margin: 0 0 16px 0; color: #0f172a; font-size: 24px; font-weight: 700; text-align: center;">Compte activ&eacute; avec succ&egrave;s</h2>
                        <p style="margin: 0 0 32px 0; font-size: 16px; line-height: 1.6; color: #64748b; text-align: center;">Voici vos acc&egrave;s temporaires pour votre première connexion :</p>
                        
                        <!-- Credentials Card -->
                        <div style="background-color: #f1f5f9; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
                            <div style="margin-bottom: 20px;">
                                <p style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Email</p>
                                <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e293b;">${userEmail}</p>
                            </div>
                            <div style="border-top: 1px solid #e2e8f0; padding-top: 20px;">
                                <p style="margin: 0; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: #94a3b8;">Mot de passe temporaire</p>
                                <p style="margin: 4px 0 0 0; font-size: 24px; font-weight: 800; color: #312782; font-family: 'Courier New', Courier, monospace;">${tempPassword}</p>
                            </div>
                        </div>
                        
                        <!-- CTA -->
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td align="center">
                                    <a href="${loginUrl}" target="_blank" style="display: inline-block; padding: 18px 48px; background-color: #312782; color: #ffffff; text-decoration: none; font-weight: 700; font-size: 16px; border-radius: 12px;">
                                        Se connecter maintenant
                                    </a>
                                </td>
                            </tr>
                        </table>
                        
                        <!-- Security Note -->
                        <div style="margin-top: 32px; padding: 16px; border-radius: 8px; background-color: #fffbeb; border-left: 4px solid #f59e0b;">
                            <p style="margin: 0; font-size: 13px; color: #b45309; line-height: 1.5;">
                                <strong>Important :</strong> Pour votre s&eacute;curit&eacute;, il vous sera demand&eacute; de changer ce mot de passe dès votre première connexion.
                            </p>
                        </div>
                    </td>
                </tr>
                
                <!-- Footer -->
                <tr>
                    <td style="background-color: #f8fafc; padding: 32px; text-align: center; border-top: 1px solid #f1f5f9;">
                        <p style="margin: 0 0 8px 0; color: #64748b; font-size: 14px; font-weight: 600;">&copy; ${new Date().getFullYear()} ${appName}</p>
                        <p style="margin: 0; color: #94a3b8; font-size: 12px;">S&eacute;curit&eacute; et Performance.</p>
                    </td>
                </tr>
            </table>
        </body>
        </html>`;
    }
}

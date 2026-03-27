


export default class TemplateEnvoieEmail {
    

     static getTemplateEnvoiCode(appName: string, code: string): string {
        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        </head>
        <body style="font-family: sans-serif;">
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
            </div>
            </body>
        </html>`;
    }


    static getTemplateVerifyEmail(appName: string, BASE_URL: string, confirmationToken: string, userEmail: string): string {
        
        const confirmationUrl = `${BASE_URL}confirm-receipt?token=${encodeURIComponent(confirmationToken)}&email=${encodeURIComponent(userEmail)}`;

        return `
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
            <title>Confirmation de compte</title>
        </head>
        <body style="margin: 0; padding: 0; width: 100% !important; -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; background-color: #f4f4f7;">
            <div style="background-color: #f4f4f7; padding: 20px; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
                <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                    
                    <tr>
                        <td style="background-color: #312782; padding: 40px 20px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700; letter-spacing: -0.5px; text-transform: uppercase;">
                                ${appName}
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <h2 style="color: #1a1a1a; font-size: 22px; margin-top: 0; margin-bottom: 20px; font-weight: 600;">
                                Vérification de votre compte
                            </h2>
                            <p style="color: #51545e; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Un administrateur a créé un compte pour vous sur <strong>${appName}</strong>.<br>
                                Pour activer vos accès et confirmer la bonne réception de ce message, merci de cliquer sur le bouton ci-dessous :
                            </p>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" bgcolor="#28a745" style="border-radius: 6px;">
                                                    <a href="${confirmationUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 6px; border: 1px solid #28a745;">
                                                        Confirmer la réception
                                                    </a>
                                                </td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>

                            <p style="color: #9ca3af; font-size: 13px; margin-top: 20px; font-style: italic;">
                                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :<br>
                                <span style="color: #312782; word-break: break-all;">${confirmationUrl}</span>
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #f8f9fa; padding: 24px; text-align: center; border-top: 1px solid #edf2f7;">
                            <p style="margin: 0; color: #718096; font-size: 12px; line-height: 1.5;">
                                © ${new Date().getFullYear()} <strong>${appName}</strong>. Tous droits réservés.<br>
                                Ceci est un message automatique, merci de ne pas y répondre.
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>`;
    }



    static getTemplateWelcome(appName: string, tempPassword: string, userEmail: string, loginUrl: string): string {
        return `
            <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8"> <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
                </head>
                <body style="font-family: sans-serif;">
                    <div style="background-color: #f4f4f7; padding: 20px; font-family: 'Segoe UI', Tahoma, sans-serif;">
                        <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
                            <tr>
                                <td style="background-color: #312782; padding: 30px; text-align: center;">
                                    <h2 style="color: #ffffff; margin: 0; font-size: 24px;">Bienvenue sur ${appName}</h2>
                                </td>
                            </tr>

                            <tr>
                                <td style="padding: 40px 30px; text-align: center;">
                                    <p style="font-size: 16px; color: #495057; margin-bottom: 25px;">
                                        Votre compte a été activé avec succès. Voici vos accès temporaires :
                                    </p>

                                    <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; padding: 25px; border-radius: 8px; margin-bottom: 30px; text-align: left;">
                                        <div style="margin-bottom: 15px;">
                                            <p style="margin: 0; color: #6c757d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Identifiant (Email) :</p>
                                            <p style="margin: 5px 0 0 0; color: #1a1a1a; font-size: 16px; font-weight: 600;">${userEmail}</p>
                                        </div>
                                        
                                        <div style="border-top: 1px solid #eee; pt-15px; margin-top: 15px; padding-top: 15px;">
                                            <p style="margin: 0; color: #6c757d; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px;">Mot de passe temporaire :</p>
                                            <p style="margin: 5px 0 0 0; color: #312782; font-size: 22px; font-weight: bold; letter-spacing: 1px; font-family: monospace;">${tempPassword}</p>
                                        </div>
                                    </div>

                                    <a href="${loginUrl}" style="display: inline-block; background-color: #28a745; color: white; padding: 16px 35px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                                        Se connecter maintenant
                                    </a>

                                    <p style="color: #dc3545; font-size: 13px; margin-top: 25px; font-weight: 500;">
                                        ⚠️ Pour votre sécurité, il vous sera demandé de changer ce mot de passe dès votre première connexion.
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                        © ${new Date().getFullYear()} ${appName}. Sécurité et Performance.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </body>
            </html>`;
    }
    
}

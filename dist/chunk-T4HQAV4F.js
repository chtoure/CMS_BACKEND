import {
  Paginator,
  PrismaClient_default,
  prismaNamespace_exports
} from "./chunk-A6KLEGV2.js";

// src/Services/UserService.ts
import * as bcrypt from "bcrypt";
import crypto from "crypto";

// src/Services/EmailService.ts
import axios from "axios";

// src/Utils/TemplateEnvoieEmail.ts
var TemplateEnvoieEmail = class {
  static getTemplateEnvoiCode(appName, code) {
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
                    <p style="font-size: 16px; color: #495057;">Veuillez saisir le code envoy\xE9 pour confirmer votre email :</p>
                    <div style="background-color: #f8f9fa; border: 2px dashed #312782; padding: 20px; margin: 25px 0; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #312782; border-radius: 8px;">
                        ${code}
                    </div>
                    <p style="font-size: 14px; color: #6c757d;">Ce code expirera dans 10 minutes par mesure de s\xE9curit\xE9.</p>
                </div>
                <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                    <p style="margin: 0; color: #6c757d; font-size: 12px;">
                        \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ${appName}. Tous droits r\xE9serv\xE9s.
                    </p>
                </div>
            </div>
            </body>
        </html>`;
  }
  static getTemplateVerifyEmail(appName, BASE_URL, confirmationToken, userEmail) {
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
                                V\xE9rification de votre compte
                            </h2>
                            <p style="color: #51545e; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                                Un administrateur a cr\xE9\xE9 un compte pour vous sur <strong>${appName}</strong>.<br>
                                Pour activer vos acc\xE8s et confirmer la bonne r\xE9ception de ce message, merci de cliquer sur le bouton ci-dessous :
                            </p>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center" style="padding-bottom: 20px;">
                                        <table border="0" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td align="center" bgcolor="#28a745" style="border-radius: 6px;">
                                                    <a href="${confirmationUrl}" target="_blank" style="display: inline-block; padding: 16px 36px; font-family: 'Segoe UI', Arial, sans-serif; font-size: 16px; color: #ffffff; text-decoration: none; font-weight: bold; border-radius: 6px; border: 1px solid #28a745;">
                                                        Confirmer la r\xE9ception
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
                                \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} <strong>${appName}</strong>. Tous droits r\xE9serv\xE9s.<br>
                                Ceci est un message automatique, merci de ne pas y r\xE9pondre.
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
        </body>
        </html>`;
  }
  static getTemplateWelcome(appName, tempPassword, userEmail, loginUrl) {
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
                                        Votre compte a \xE9t\xE9 activ\xE9 avec succ\xE8s. Voici vos acc\xE8s temporaires :
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
                                        \u26A0\uFE0F Pour votre s\xE9curit\xE9, il vous sera demand\xE9 de changer ce mot de passe d\xE8s votre premi\xE8re connexion.
                                    </p>
                                </td>
                            </tr>

                            <tr>
                                <td style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e9ecef;">
                                    <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                        \xA9 ${(/* @__PURE__ */ new Date()).getFullYear()} ${appName}. S\xE9curit\xE9 et Performance.
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </div>
                </body>
            </html>`;
  }
};

// src/Services/EmailService.ts
var EmailService = class {
  // L'URL de ton API Enerlog extraite du code Laravel
  static API_URL = process.env.API_URL_SENDEMAIL || "https://cpay.enerlog.net/message/send/mail";
  static APP_NAME = process.env.APP_NAME || "Compositor";
  static BASE_URL = process.env.APP_URL || "http://localhost:3000/";
  static LOGIN_URL = process.env.URL_LOGIN_FRONT || "http://localhost:5173/site/admin/auth/login";
  /**
   * Envoie le code de vérification en utilisant l'API Enerlog
   */
  static async sendVerificationCode(toEmail, code) {
    const htmlContent = TemplateEnvoieEmail.getTemplateEnvoiCode(this.APP_NAME, code);
    const payload = {
      subject: `Code de v\xE9rification - ${this.APP_NAME}`,
      body: htmlContent,
      // Le contenu HTML généré plus bas
      fromEmail: "no-reply@enerlog.net",
      fromName: `${this.APP_NAME} Bot`,
      toEmail,
      toName: "Utilisateur Compositor"
    };
    try {
      const response = await axios.post(this.API_URL, payload);
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
  static async sendVerificationEmail(toEmail, confirmationToken) {
    const htmlContent = TemplateEnvoieEmail.getTemplateVerifyEmail(this.APP_NAME, this.BASE_URL, confirmationToken, toEmail);
    const payload = {
      subject: `Confirmation de votre compte - ${this.APP_NAME}`,
      body: htmlContent,
      // Le contenu HTML généré plus bas
      fromEmail: "no-reply@enerlog.net",
      fromName: `${this.APP_NAME} Bot`,
      toEmail,
      toName: "Utilisateur Compositor"
    };
    try {
      const response = await axios.post(this.API_URL, payload);
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
  static async sendWelcome(toEmail, tempPassword) {
    const htmlContent = TemplateEnvoieEmail.getTemplateWelcome(this.APP_NAME, tempPassword, toEmail, this.LOGIN_URL);
    const payload = {
      subject: `Bienvenue sur ${this.APP_NAME}`,
      body: htmlContent,
      // Le contenu HTML généré plus bas
      fromEmail: "no-reply@enerlog.net",
      fromName: `${this.APP_NAME} Bot`,
      toEmail,
      toName: "Utilisateur Compositor"
    };
    try {
      const response = await axios.post(this.API_URL, payload);
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
  static generateOTP() {
    return Math.floor(1e5 + Math.random() * 9e5).toString();
  }
  // Calcule la date d'expiration
  static getExpirationDate(minutes) {
    return new Date(Date.now() + minutes * 60 * 1e3);
  }
};

// src/Utils/Constantes/ConstantesHttp.ts
var HTTP_STATUS_OK = 200;
var HTTP_STATUS_CREATED = 201;
var HTTP_STATUS_NO_CONTENT = 204;
var HTTP_STATUS_BAD_REQUEST = 400;
var HTTP_STATUS_UNAUTHORIZED = 401;
var HTTP_STATUS_FORBIDDEN = 403;
var HTTP_STATUS_NOT_FOUND = 404;
var HTTP_STATUS_CONFLICT = 409;
var HTTP_STATUS_INTERNAL_SERVER_ERROR = 500;

// src/Utils/ErrorPrisma.ts
var handlePrismaError = (error) => {
  if (error instanceof Error && !error.hasOwnProperty("code") && error.name !== "PrismaClientValidationError") {
    return error.message;
  }
  if (error.code && typeof error.code === "string" && error.code.startsWith("P")) {
    switch (error.code) {
      case "P2002":
        const target = error.meta?.target?.join(", ") || "ce champ";
        return `Doublon d\xE9tect\xE9 : Un enregistrement avec le m\xEAme "${target}" existe d\xE9j\xE0. Veuillez modifier cette valeur.`;
      case "P2025":
        return "Op\xE9ration impossible : L'\xE9l\xE9ment que vous tentez de modifier ou supprimer est introuvable (il a peut-\xEAtre d\xE9j\xE0 \xE9t\xE9 supprim\xE9). D\xE9tail: " + (error.meta?.cause || JSON.stringify(error.meta));
      case "P2003":
        return "Action refus\xE9e : Cet \xE9l\xE9ment est li\xE9 \xE0 d'autres donn\xE9es importantes et ne peut pas \xEAtre supprim\xE9 pour le moment.";
      case "P2000":
        return "Saisie trop longue : Le texte que vous avez entr\xE9 d\xE9passe la limite autoris\xE9e pour ce champ.";
      case "P2021":
        return "Erreur technique : La table est introuvable. Veuillez contacter l'administrateur.";
      default:
        return `Une contrainte de s\xE9curit\xE9 a bloqu\xE9 l'op\xE9ration (${error.code}).`;
    }
  }
  if (error.name === "PrismaClientValidationError" || error instanceof prismaNamespace_exports.PrismaClientValidationError) {
    console.error("Prisma Validation Error Trace:", error.message);
    return "La structure des donn\xE9es est invalide. V\xE9rifiez les types envoy\xE9s. D\xE9tail : " + error.message;
  }
  return "Une erreur inattendue est survenue sur le serveur.";
};
var getErrorStatus = (error) => {
  if (error instanceof Error && !error.hasOwnProperty("code") && error.name !== "PrismaClientValidationError") {
    return HTTP_STATUS_BAD_REQUEST;
  }
  if (error.code) {
    switch (error.code) {
      case "P2002":
        return HTTP_STATUS_CONFLICT;
      // 409
      case "P2025":
        return HTTP_STATUS_NOT_FOUND;
      // 404
      case "P2003":
        return HTTP_STATUS_BAD_REQUEST;
      // 400
      default:
        return HTTP_STATUS_BAD_REQUEST;
    }
  }
  if (error.name === "PrismaClientValidationError") {
    return HTTP_STATUS_BAD_REQUEST;
  }
  return HTTP_STATUS_INTERNAL_SERVER_ERROR;
};
var AppError = class extends Error {
  constructor(message) {
    super(message);
    this.message = message;
    this.name = "AppError";
  }
};

// src/Services/UserService.ts
var SALT_ROUNDS = 10;
var UserService = class {
  buildWhereClause(filter) {
    const where = {};
    if (filter?.archive !== void 0) {
      where.archive = filter.archive;
    }
    if (filter?.search?.trim()) {
      const query = filter.search.trim();
      where.OR = [
        { email: { contains: query } },
        { full_name: { contains: query } },
        { role: { name: { contains: query } } }
      ];
    }
    return where;
  }
  // Creation d'un utilisateur
  async createUser(data) {
    return PrismaClient_default.user.create({
      data,
      include: { role: true }
    });
  }
  async getAllUsers(filter) {
    return Paginator.paginate(PrismaClient_default.user, {
      page: filter?.page,
      limit: filter?.limit,
      where: this.buildWhereClause(filter),
      include: { role: true },
      orderBy: { createdAt: "desc" }
    });
  }
  // Récupère un utilisateur par ID
  async getUserById(id) {
    return PrismaClient_default.user.findUnique({
      where: { id, archive: false },
      include: { role: true }
    });
  }
  // Récupère un utilisateur par email
  async getUserByEmail(email) {
    return PrismaClient_default.user.findUnique({
      where: { email },
      include: { role: true }
    });
  }
  // Récupère un utilisateur non archivé par email
  async getUserByEmailNonArchive(email) {
    return PrismaClient_default.user.findUnique({
      where: { email, archive: false, status: "ACTIVE" },
      include: {
        role: {
          include: {
            permissions: true
          }
        }
      }
    });
  }
  // Recuperer un user par RefreshToken 
  async getUserByToken(refreshToken) {
    return PrismaClient_default.user.findUnique({
      where: { refreshToken },
      include: { role: true }
    });
  }
  // Modifier un utilisateur
  async updateUser(id, userData) {
    return PrismaClient_default.user.update({
      where: { id },
      data: userData,
      include: { role: true }
    });
  }
  // Archiver les utilisateurs
  async deleteUser(id) {
    return PrismaClient_default.user.update({
      where: { id, archive: false },
      data: {
        archive: true,
        archivedAt: /* @__PURE__ */ new Date(),
        isActiveAt: null,
        status: "INACTIVE"
      },
      include: { role: true }
    });
  }
  // Restorer un utilisateur archiver
  async restoreUser(id) {
    return PrismaClient_default.user.update({
      where: { id, archive: true },
      data: {
        archive: false,
        archivedAt: null,
        isActiveAt: /* @__PURE__ */ new Date(),
        status: "ACTIVE"
      },
      include: { role: true }
    });
  }
  // Hache un mot de passe en texte clair.
  async hashPassword(password) {
    return bcrypt.hash(password, SALT_ROUNDS);
  }
  // Compare le mot de passe fourni avec le hachage stocké.
  async comparePassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  }
  // Change mot de passe d'un utilisateur
  async changeUserPassword(userId, newPassword) {
    const hashedPassword = await this.hashPassword(newPassword);
    return this.updateUser(userId, { password_hash: hashedPassword, isLoggedIn: true });
  }
  // Verifie le code de reinitialisation et la date d'expiration
  async verifyResetCode(userId, code) {
    return PrismaClient_default.user.findFirst({
      where: {
        id: userId,
        resetCode: code,
        codeExpiration: {
          gt: /* @__PURE__ */ new Date()
          // Vérifie que la date d'expiration est dans le futur
        }
      },
      include: { role: true }
    });
  }
  generateTemporaryPassword() {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
    let password = "Default-";
    for (let i = 0; i < 8; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      password += chars.charAt(randomIndex);
      if (i === 3) password += "-";
    }
    return password;
  }
  async resendConfirmationEmail(userId) {
    try {
      const newToken = crypto.randomBytes(32).toString("hex");
      const user = await PrismaClient_default.user.update({
        where: {
          id: userId,
          status: "EN_ATTENTE"
        },
        data: { confirmationToken: newToken }
      });
      return await EmailService.sendVerificationEmail(user.email, newToken);
    } catch (error) {
      if (error.code === "P2025") {
        throw new Error("Impossible de renvoyer l'email : le compte est d\xE9j\xE0 valid\xE9 ou inexistant.");
      }
      throw error;
    }
  }
  async confirmEmail(token, email) {
    const user = await PrismaClient_default.user.findUnique({ where: { email } });
    if (!user) return null;
    if (user.confirmationToken !== token) return null;
    const password = this.generateTemporaryPassword();
    await PrismaClient_default.user.update({
      where: { id: user.id },
      data: {
        status: "ACTIVE",
        confirmationToken: null,
        isPendingAt: null,
        isActiveAt: /* @__PURE__ */ new Date(),
        password_hash: await this.hashPassword(password)
      }
    });
    return { user, password };
  }
  async deleteDefinitivelyUser(id) {
    const user = await PrismaClient_default.user.findUnique({
      where: { id },
      include: {
        role: true,
        _count: {
          select: {
            entries: true,
            contentTypes: true,
            taxonomies: true
          }
        }
      }
    });
    if (!user) throw new AppError("Utilisateur non trouv\xE9 ou non archiv\xE9.");
    if (user.archive === false || user.status === "ACTIVE") throw new AppError("Utilisateur non archiv\xE9 ou non en attente.");
    if (user.role?.name) throw new AppError("Impossible de supprimer : l'utilisateur a un R\xF4le.");
    if (user._count.entries > 0) throw new AppError("Impossible de supprimer : l'utilisateur a cr\xE9\xE9 des entr\xE9es.");
    if (user._count.contentTypes > 0) throw new AppError("Impossible de supprimer : l'utilisateur a cr\xE9\xE9 des types.");
    return await PrismaClient_default.user.delete({
      where: { id }
    });
  }
};

export {
  HTTP_STATUS_OK,
  HTTP_STATUS_CREATED,
  HTTP_STATUS_NO_CONTENT,
  HTTP_STATUS_BAD_REQUEST,
  HTTP_STATUS_UNAUTHORIZED,
  HTTP_STATUS_FORBIDDEN,
  HTTP_STATUS_NOT_FOUND,
  HTTP_STATUS_CONFLICT,
  HTTP_STATUS_INTERNAL_SERVER_ERROR,
  EmailService,
  handlePrismaError,
  getErrorStatus,
  AppError,
  UserService
};

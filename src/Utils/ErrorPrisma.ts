
import { Prisma } from "../generated/prisma/client.ts";
import { 
    HTTP_STATUS_CONFLICT, 
    HTTP_STATUS_BAD_REQUEST, 
    HTTP_STATUS_INTERNAL_SERVER_ERROR, 
    HTTP_STATUS_NOT_FOUND 
} from "./Constantes/ConstantesHttp.ts";

/**
 * Traduit les erreurs techniques en messages compréhensibles par l'utilisateur
 */
export const handlePrismaError = (error: any): string => {
  
  // 1. Erreurs manuelles (AppError ou throw new Error)
  // On vérifie si c'est une erreur classique sans code Prisma
  if (error instanceof Error && !error.hasOwnProperty('code') && error.name !== 'PrismaClientValidationError') {
    return error.message;
  }

  // 2. Erreurs de Contraintes Prisma (P2002, P2003, etc.)
  // On teste le code directement pour être plus robuste que le "instanceof"
  if (error.code && typeof error.code === 'string' && error.code.startsWith('P')) {
    switch (error.code) {
      case 'P2002':
        const target = (error.meta?.target as string[])?.join(', ') || 'un champ';
        return `La valeur pour ${target} existe déjà.`;
      case 'P2025':
        return "L'élément demandé n'existe pas.";
      case 'P2003':
        return "Impossible de supprimer : cet élément est utilisé par d'autres données.";
      case 'P2000':
        return "La valeur fournie est trop longue pour l'un des champs.";
      default:
        return `Erreur de base de données (${error.code})`;
    }
  }

  // 3. Erreurs de validation de Prisma (ex: le fameux Argument id is missing / NaN)
  // On masque le stack trace ici
  if (error.name === 'PrismaClientValidationError' || error instanceof Prisma.PrismaClientValidationError) {
    return "La structure des données est invalide. Vérifiez les types envoyés (ex: IDs de taxonomies).";
  }

  // 4. Par défaut
  return "Une erreur inattendue est survenue sur le serveur.";
};

/**
 * Détermine le code de statut HTTP approprié selon l'erreur
 */
export const getErrorStatus = (error: any): number => {
  // Erreurs de validation métier (via throw new Error)
  if (error instanceof Error && !error.hasOwnProperty('code') && error.name !== 'PrismaClientValidationError') {
    return HTTP_STATUS_BAD_REQUEST;
  }

  // Codes spécifiques Prisma
  if (error.code) {
    switch (error.code) {
      case 'P2002': return HTTP_STATUS_CONFLICT;   // 409
      case 'P2025': return HTTP_STATUS_NOT_FOUND;  // 404
      case 'P2003': return HTTP_STATUS_BAD_REQUEST; // 400
      default: return HTTP_STATUS_BAD_REQUEST;
    }
  }

  // Erreur de validation structurelle
  if (error.name === 'PrismaClientValidationError') {
    return HTTP_STATUS_BAD_REQUEST;
  }

  return HTTP_STATUS_INTERNAL_SERVER_ERROR;
};

// Classe d'erreur personnalisée
export class AppError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = "AppError";
  }
}
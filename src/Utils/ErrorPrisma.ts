
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

  // On teste le code directement pour être plus robuste que le "instanceof"
  if (error.code && typeof error.code === 'string' && error.code.startsWith('P')) {
  switch (error.code) {
    case 'P2002':
      // Au lieu de "La valeur existe déjà", on cible l'unicité
      const target = (error.meta?.target as string[])?.join(', ') || 'ce champ';
      return `Doublon détecté : Un enregistrement avec le même "${target}" existe déjà. Veuillez modifier cette valeur.`;

    case 'P2025':
      return "Opération impossible : L'élément que vous tentez de modifier ou supprimer est introuvable (il a peut-être déjà été supprimé).";

    case 'P2003':
      // Très important pour l'utilisateur : expliquer POURQUOI il ne peut pas supprimer
      return "Action refusée : Cet élément est lié à d'autres données importantes et ne peut pas être supprimé pour le moment.";

    case 'P2000':
      return "Saisie trop longue : Le texte que vous avez entré dépasse la limite autorisée pour ce champ.";
    
    case 'P2021':
      return "Erreur technique : La table est introuvable. Veuillez contacter l'administrateur.";

    default:
      return `Une contrainte de sécurité a bloqué l'opération (${error.code}).`;
  }
}

  // On masque le stack trace ici
  if (error.name === 'PrismaClientValidationError' || error instanceof Prisma.PrismaClientValidationError) {
    return "La structure des données est invalide. Vérifiez les types envoyés.";
  }

  // Par défaut
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
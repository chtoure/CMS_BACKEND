
import { Prisma } from "../generated/prisma/client.ts";
import { HTTP_STATUS_CONFLICT, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND } from "./Constantes/ConstantesHttp.ts";

export const handlePrismaError = (error: unknown): string => {
 
  // 1. AJOUT : Si c'est une erreur manuelle lancée avec throw new Error()
  if (error instanceof Error && !(error as any).code) {
    return error.message; // Retourne "Suppression impossible : ce type a des entrées."
  }

  // 2. Erreurs spécifiques à Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        const target = (error.meta?.target as string[])?.join(', ') || 'un champ';
        return `La valeur pour ${target} existe déjà.`;
      case 'P2025':
        return "L'élément demandé n'existe pas.";
      case 'P2003':
        return "Impossible de supprimer : l'élément est lié à d'autres données.";
      default:
        return `Erreur base de données (${error.code})`;
    }
  }

  // 3. Erreurs de validation de Prisma
  if (error instanceof Prisma.PrismaClientValidationError) {
    return "La structure des données envoyées est incorrecte pour la base de données.";
  }

  return "Une erreur inattendue est survenue sur le serveur.";
};



// Dans PrismaErrorHandler.ts
export const getErrorStatus = (error: unknown): number => {
  // 1. Si c'est une erreur manuelle (Validation métier)
  if (error instanceof Error && !(error as any).code) {
    return HTTP_STATUS_BAD_REQUEST; // Code 400
  }

  // 2. Si c'est une erreur spécifique à Prisma
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002': return HTTP_STATUS_CONFLICT;  // 409
      case 'P2025': return HTTP_STATUS_NOT_FOUND; // 404
      case 'P2003': return HTTP_STATUS_BAD_REQUEST; // 400 (Violation de contrainte)
      default: return HTTP_STATUS_BAD_REQUEST;
    }
  }

  // 3. Par défaut, si c'est un crash inconnu
  return HTTP_STATUS_INTERNAL_SERVER_ERROR; // 500
};



// classe d'erreur personnalisée
export class AppError extends Error {
  constructor(public message: string) {
    super(message);
    this.name = "AppError";
  }
}
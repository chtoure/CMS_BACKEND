
import { Prisma } from "../generated/prisma/client.ts";
import { HTTP_STATUS_CONFLICT, HTTP_STATUS_BAD_REQUEST, HTTP_STATUS_INTERNAL_SERVER_ERROR, HTTP_STATUS_NOT_FOUND } from "./Constantes/ConstantesHttp.ts";

export const handlePrismaError = (error: unknown): string => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    switch (error.code) {
      case 'P2002':
        // Erreur de contrainte unique
        const target = (error.meta?.target as string[])?.join(', ') || 'un champ';
        return `La valeur pour ${target} existe déjà.`;
      case 'P2025':
        return "L'élément demandé n'existe pas ou a déjà été supprimé.";
      case 'P2003':
        return "Impossible de supprimer cet élément car il est lié à d'autres données.";
      default:
        return `Erreur base de données (${error.code})`;
    }
  }

  if (error instanceof Prisma.PrismaClientValidationError) {
    return "La structure des données envoyées est incorrecte pour la base de données.";
  }

  return "Une erreur inattendue est survenue sur le serveur.";
};



// Dans PrismaErrorHandler.ts
export const getErrorStatus = (error: unknown): number => {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return HTTP_STATUS_CONFLICT;
    if (error.code === 'P2025') return HTTP_STATUS_NOT_FOUND;
    return HTTP_STATUS_BAD_REQUEST;
  }
  return HTTP_STATUS_INTERNAL_SERVER_ERROR; // Si on ne sait pas ce que c'est, c'est une erreur serveur
};
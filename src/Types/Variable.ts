interface Variable {
    id: number;
    name: string;
    value: string;
    collectionId: number;
    createdAt?: Date;
    updatedAt?: Date;
    // On pourra ajouter le type ici si besoin (ex: from Collection)
}

interface VariablePayload {
    name: string
    value: string
    collectionId: number
}

export type {
    Variable,
    VariablePayload
}
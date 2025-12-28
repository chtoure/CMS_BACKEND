type VariableType = 'COLOR' | 'NUMBER' | 'STRING' | 'BOOLEAN'

interface CollectionPayload {
    name: string
    type: VariableType
}

export type {
    CollectionPayload,
    VariableType
}



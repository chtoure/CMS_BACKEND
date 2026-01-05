interface Media{
    id : number,
    file_path :   string,
    type :   string,
    alt  : string | null
};

interface MediaPayload{
    file_path :   string,
    type :   string,
    alt  : string | null
}

interface MediaDeletePayload{
    ids? : number[]
}


export type {
    Media,
    MediaPayload,
    MediaDeletePayload
}

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


export type {
    Media,
    MediaPayload
}

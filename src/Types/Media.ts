interface Media{
    id : number,
    file_path :   string,
    type :   'video' | 'image',
    alt  : string | null
};

interface MediaPayload{
    file_path :   string,
    type :   'video' | 'image',
    alt  : string | null
}


export type {
    Media,
    MediaPayload
}

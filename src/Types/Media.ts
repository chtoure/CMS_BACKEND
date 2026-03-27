interface Media{
    id : number,
    file_path :   string,
    type :   string,
    alt  : string | null,
    size : number,
    width? : number | null,
    height? : number | null,
    duration? : number | null,
    pageCount? : number | null,
    createdAt : Date,
    updatedAt : Date
};

interface MediaPayload{
    file_path :   string,
    type :   string,
    alt  : string | null,
    size : number,
    width? : number | null,
    height? : number | null,
    duration? : number | null,
    pageCount? : number | null,
}

interface MediaUpdatePayload{
    alt : string,
    // width? : number | null,
    // height? : number | null,
    // duration? : number | null,
    // pageCount? : number | null,
}

interface MediaDeletePayload{
    ids? : number[]
}


export type {
    Media,
    MediaPayload,
    MediaDeletePayload,
    MediaUpdatePayload
}

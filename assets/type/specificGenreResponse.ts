type specificGenreResponseType = {
    "id": string;
    "description": string;
    "name": string;
    "type": string;
    "images": { height: number | null; url: string; width: number | null }[];
}[];

export { specificGenreResponseType };

export declare class ImageSet {
    posterUrl: string | null;
    backdropUrl: string | null;
    backdropUrl2: string | null;
    heroBackdropUrlDesktop: string | null;
    heroBackdropUrlMobile: string | null;
    logoUrl: string | null;
}
export declare class Keyword {
    id: number;
    name: string;
}
export declare class Movie {
    id: number;
    title: string;
    imageSet: ImageSet | null;
    overview: string;
    vote_average: number;
    release_date: string;
    runtime: number;
    genres: string[];
    keywords: Keyword[];
    fsk: string;
}

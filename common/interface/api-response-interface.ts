export interface ApiResponseWord {
    status: number;
    word: string;
}

export interface ApiResponseDefinition {
    status: number;
    definition: string;
}

export interface ApiResponseWords {
    status: number;
    words: string[];
}
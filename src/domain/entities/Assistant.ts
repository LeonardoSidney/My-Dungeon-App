import { Model } from "./Model";

export type Assistant = {
    name: string;
    model: Model;
    topK: number;
    temperature: number;
    minP: number;
    repetitionPenalty: number;
};

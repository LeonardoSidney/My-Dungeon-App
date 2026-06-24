import { Model } from "./Model";
import { Sampler } from "./Sampler";

export type Assistant = {
    id: string;
    name: string;
    observation?: string;
    model: Model;
    sampler: Sampler;
    createdAt: Date;
    updatedAt: Date;
};

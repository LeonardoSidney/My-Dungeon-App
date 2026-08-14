export interface ApplyTemplateEntity {
    prompt: string;
}

export class ApplyTemplateResponseDTO {
    constructor (
        public readonly prompt: string
    ) { }

    toEntity (): ApplyTemplateEntity {
        return { prompt: this.prompt };
    }
}

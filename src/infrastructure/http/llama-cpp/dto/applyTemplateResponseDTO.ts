import { LlamaCppGateway } from '@infra/http/llama-cpp/llamaCppGateway';

export class ApplyTemplateResponseDTO {
    constructor(
        public readonly prompt: string
    ) { }

    toEntity(): LlamaCppGateway.templateResponse {
        return { prompt: this.prompt };
    }
}

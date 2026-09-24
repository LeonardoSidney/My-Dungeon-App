import { Connection } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IHashProvider } from '@domain/providers';
import { IModelTemplateRepository } from '@domain/repository';
import { IGetModelTemplateService } from '@domain/services';
import { GetModelTemplateUseCaseParams, GetModelTemplateUseCaseResponse, IGetModelTemplateUseCase } from '@domain/use-cases';

export class GetModelTemplateUseCase implements IGetModelTemplateUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly modelTemplateRepository: IModelTemplateRepository,
        private readonly getModelTemplateService: IGetModelTemplateService,
        private readonly hashProvider: IHashProvider
    ) { }

    async execute (params: GetModelTemplateUseCaseParams): Promise<GetModelTemplateUseCaseResponse> {
        this.logger.info('Executing GetModelTemplateUseCase::execute');

        this.validate(params);

        const connectionKey = this.buildConnectionKey(params.connection);
        const cached = await this.modelTemplateRepository.getModelTemplate({ modelId: params.modelId, connection: connectionKey });

        if (cached && cached.editedByUser) {
            this.logger.debug('Executing GetModelTemplateUseCase::execute - serving user-edited cache');
            return { success: true, modelTemplate: cached };
        }

        const fetched = await this.getModelTemplateService.fetchModelTemplate(params);

        if (!fetched.success || fetched.template === undefined) {
            if (cached) {
                this.logger.debug('Executing GetModelTemplateUseCase::execute - provider failed, serving cache');
                return { success: true, modelTemplate: cached };
            }

            return { success: false, error: fetched.error };
        }

        if (cached && cached.hash !== undefined && cached.hash === this.hashProvider.md5(fetched.template)) {
            return { success: true, modelTemplate: cached };
        }

        const modelTemplate = this.getModelTemplateService.buildModelTemplate({ modelId: params.modelId, connection: connectionKey, template: fetched.template, cached });
        await this.modelTemplateRepository.saveModelTemplate({ modelTemplate });
        this.logger.debug('Executing GetModelTemplateUseCase::execute - model template saved: ', modelTemplate);

        return { success: true, modelTemplate };
    }

    private buildConnectionKey (connection: Connection): string {
        const portSuffix = connection.port ? `:${connection.port}` : '';
        return `${connection.ip}${portSuffix}`;
    }

    private validate (params: GetModelTemplateUseCaseParams): void {
        if (!params.modelId?.trim()) {
            throw new Error('A modelId is required to get the model template');
        }

        if (!params.connection?.ip?.trim()) {
            throw new Error('A connection with a valid ip is required to get the model template');
        }
    }
}

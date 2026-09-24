import { ModelTemplate } from '@domain/entities';
import { IModelProviderGateway } from '@domain/gateways';
import { ILogger } from '@domain/logger';
import { IHashProvider, IIdGenerator } from '@domain/providers';
import { BuildModelTemplateServiceParams, FetchModelTemplateServiceParams, FetchModelTemplateServiceResponse, IGetModelTemplateService } from '@domain/services';

export class GetModelTemplateService implements IGetModelTemplateService {
    constructor (
        private readonly logger: ILogger,
        private readonly gateway: IModelProviderGateway,
        private readonly idGenerator: IIdGenerator,
        private readonly hashProvider: IHashProvider
    ) { }

    buildModelTemplate (params: BuildModelTemplateServiceParams): ModelTemplate {
        const now = new Date();
        const hash = this.hashProvider.md5(params.template);
        const createdAt = params.cached ? params.cached.createdAt : now;

        return {
            id: this.idGenerator.generate(),
            modelId: params.modelId,
            connection: params.connection,
            template: params.template,
            hash,
            editedByUser: false,
            createdAt,
            updatedAt: now
        };
    }

    async fetchModelTemplate (params: FetchModelTemplateServiceParams): Promise<FetchModelTemplateServiceResponse> {
        this.logger.info('Execute GetModelTemplateService::fetchModelTemplate');

        const { connection, modelId } = params;
        const props = await this.gateway.getProps({ connection, modelId, autoload: false });
        this.logger.debug('Execute GetModelTemplateService::fetchModelTemplate - props: ', props);

        if (!props) {
            return { success: false, error: 'props response was empty' };
        }

        if (props.chatTemplate === null) {
            return { success: false, error: 'model does not expose a chat template' };
        }

        if (props.modelAlias !== null && props.modelAlias !== modelId) {
            return { success: false, error: `model alias mismatch: expected ${modelId}, got ${props.modelAlias}` };
        }

        return { success: true, template: props.chatTemplate };
    }
}

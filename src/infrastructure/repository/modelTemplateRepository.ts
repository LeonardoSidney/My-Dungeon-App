import { MODEL_TEMPLATE_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { ModelTemplate } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { GetModelTemplateRepositoryParams, IModelTemplateRepository, SaveModelTemplateParams } from '@domain/repository';
import { IStorage } from '@domain/storage';
import { ModelTemplateDTO } from '../dto';

export class ModelTemplateRepository implements IModelTemplateRepository {
    constructor (
        private readonly logger: ILogger,
        private readonly storage: IStorage
    ) { }

    private get storageKey (): string {
        return `${STORAGE_NAMESPACE}/${MODEL_TEMPLATE_STORAGE_NAMESPACE}`;
    }

    private isSameTemplate (template: ModelTemplate, modelId: string, connection: string): boolean {
        return template.modelId === modelId && template.connection === connection;
    }

    private async getModelTemplates (): Promise<ModelTemplate[]> {
        const rawData = await this.storage.load<unknown[]>(this.storageKey);
        this.logger.debug('Executing ModelTemplateRepository::getModelTemplates - rawData: ', rawData);

        if (!rawData) {
            return [];
        }

        const templates: ModelTemplate[] = [];
        for (const templateUnknown of rawData) {
            const template = ModelTemplateDTO.fromStorage(templateUnknown);
            if (template) {
                templates.push(template.toEntity());
            }
        }

        if (rawData.length !== templates.length) {
            this.logger.warning('Some model templates were not converted to entity');
        }

        return templates;
    }

    private upsert (templates: ModelTemplate[], modelTemplate: ModelTemplate): void {
        const index = templates.findIndex((t) => this.isSameTemplate(t, modelTemplate.modelId, modelTemplate.connection));

        if (index === -1) {
            templates.push(modelTemplate);
            return;
        }

        templates[index] = modelTemplate;
    }

    async getModelTemplate (params: GetModelTemplateRepositoryParams): Promise<ModelTemplate | undefined> {
        this.logger.info('Executing ModelTemplateRepository::getModelTemplate');
        const { modelId, connection } = params;

        try {
            const templates = await this.getModelTemplates();
            return templates.find((t) => this.isSameTemplate(t, modelId, connection));
        } catch (error) {
            this.logger.error('Error on ModelTemplateRepository::getModelTemplate', error);
            throw error;
        }
    }

    async saveModelTemplate (params: SaveModelTemplateParams): Promise<boolean> {
        this.logger.info('Executing ModelTemplateRepository::saveModelTemplate');
        this.logger.debug('Executing ModelTemplateRepository::saveModelTemplate - params: ', params);

        try {
            const { modelTemplate } = params;
            const templates = await this.getModelTemplates();
            this.upsert(templates, modelTemplate);
            await this.storage.save(this.storageKey, templates);
        } catch (error) {
            this.logger.error('Error on ModelTemplateRepository::saveModelTemplate', error);
            throw error;
        }

        return true;
    }
}

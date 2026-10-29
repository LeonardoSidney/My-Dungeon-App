import { MODEL_TEMPLATE_STORAGE_NAMESPACE, STORAGE_NAMESPACE } from '@domain/constants/general';
import { ModelTemplate } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    GetModelTemplateRepositoryParams,
    GetModelTemplateRepositoryReturn,
    GetModelTemplatesReturn,
    IModelTemplateRepository,
    SaveModelTemplateParams,
    SaveModelTemplateRepositoryReturn,
} from '@domain/repository';
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

    private async getModelTemplates (): Promise<GetModelTemplatesReturn> {
        const loaded = await this.storage.load<unknown>(this.storageKey);
        if (!loaded.success) {
            this.logger.warning('ModelTemplateRepository::getModelTemplates - failed to load model templates', loaded.error);
            return { success: false, error: 'Failed to load model templates' };
        }

        const rawData = loaded.data ?? [];
        this.logger.storage('Executing ModelTemplateRepository::getModelTemplates - rawData: ', rawData);

        if (!Array.isArray(rawData)) {
            this.logger.warning('ModelTemplateRepository::getModelTemplates - stored model templates are not a list');
            return { success: false, error: 'Failed to load model templates' };
        }

        const modelTemplates: ModelTemplate[] = [];
        for (const templateUnknown of rawData) {
            const template = ModelTemplateDTO.fromStorage(templateUnknown);
            if (template) {
                modelTemplates.push(template.toEntity());
            }
        }

        if (rawData.length !== modelTemplates.length) {
            this.logger.warning('Some model templates were not converted to entity');
        }

        return { success: true, modelTemplates };
    }

    private upsert (templates: ModelTemplate[], modelTemplate: ModelTemplate): void {
        const index = templates.findIndex((t) => this.isSameTemplate(t, modelTemplate.modelId, modelTemplate.connection));

        if (index === -1) {
            templates.push(modelTemplate);
            return;
        }

        templates[index] = modelTemplate;
    }

    async getModelTemplate (params: GetModelTemplateRepositoryParams): Promise<GetModelTemplateRepositoryReturn> {
        this.logger.info('Executing ModelTemplateRepository::getModelTemplate');
        const { modelId, connection } = params;

        const response = await this.getModelTemplates();
        if (!response.success || !response.modelTemplates) {
            return { success: false, error: response.error };
        }

        return {
            success: true,
            modelTemplate: response.modelTemplates.find((t) => this.isSameTemplate(t, modelId, connection)),
        };
    }

    async saveModelTemplate (params: SaveModelTemplateParams): Promise<SaveModelTemplateRepositoryReturn> {
        this.logger.info('Executing ModelTemplateRepository::saveModelTemplate');
        this.logger.storage('Executing ModelTemplateRepository::saveModelTemplate - params: ', params);

        const response = await this.getModelTemplates();
        if (!response.success || !response.modelTemplates) {
            return { success: false, error: 'Failed to save model template' };
        }

        const templates = response.modelTemplates;
        this.upsert(templates, params.modelTemplate);

        const saved = await this.storage.save(this.storageKey, templates);
        if (!saved.success) {
            this.logger.warning('ModelTemplateRepository::saveModelTemplate - failed to persist model templates', saved.error);
            return { success: false, error: 'Failed to save model template' };
        }

        return { success: true };
    }
}

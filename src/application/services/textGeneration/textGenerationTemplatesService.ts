import {
    DEFAULT_TEXT_ADVENTURE_ABILITIES_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_CHARACTERS_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_IA_CONTROLLED_CHARACTER_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_ITEMS_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_LOCATIONS_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_PROFICIENCIES_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_STATUSES_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_SYSTEM_PROMPT_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_WORLD_MASTER_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE,
} from '@domain/constants/textGeneration';
import { ILogger } from '@domain/logger';
import {
    AbilitiesTemplateServiceResponse,
    CharactersTemplateServiceResponse,
    IaControlledCharacterTemplateServiceResponse,
    ItemsTemplateServiceResponse,
    LocationsTemplateServiceResponse,
    ProficienciesTemplateServiceResponse,
    RootTemplateServiceResponse,
    StatusesTemplateServiceResponse,
    SystemPromptTemplateServiceResponse,
    ITextGenerationTemplatesService,
    WorldMasterTemplateServiceResponse,
    WorldsTemplateServiceResponse,
} from '@domain/services';

export class TextGenerationTemplatesService implements ITextGenerationTemplatesService {
    constructor (
        private readonly logger: ILogger
    ) { }

    getRootTemplate (): RootTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getRootTemplate');
        return { success: true, template: DEFAULT_TEXT_ADVENTURE_TEMPLATE };
    }

    getSystemPromptTemplate (): SystemPromptTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getSystemPromptTemplate');
        return { success: true, template: DEFAULT_TEXT_ADVENTURE_SYSTEM_PROMPT_TEMPLATE };
    }

    getWorldMasterTemplate (): WorldMasterTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getWorldMasterTemplate');
        return { success: true, template: DEFAULT_TEXT_ADVENTURE_WORLD_MASTER_TEMPLATE };
    }

    getIaControlledCharacterTemplate (): IaControlledCharacterTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getIaControlledCharacterTemplate');
        return { success: true, template: DEFAULT_TEXT_ADVENTURE_IA_CONTROLLED_CHARACTER_TEMPLATE };
    }

    getWorldsTemplate (): WorldsTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getWorldsTemplate');
        return { success: true, template: DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE };
    }

    getLocationsTemplate (): LocationsTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getLocationsTemplate');
        return { success: true, template: DEFAULT_TEXT_ADVENTURE_LOCATIONS_TEMPLATE };
    }

    getItemsTemplate (): ItemsTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getItemsTemplate');
        return { success: true, template: DEFAULT_TEXT_ADVENTURE_ITEMS_TEMPLATE };
    }

    getAbilitiesTemplate (): AbilitiesTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getAbilitiesTemplate');
        return { success: true, template: DEFAULT_TEXT_ADVENTURE_ABILITIES_TEMPLATE };
    }

    getProficienciesTemplate (): ProficienciesTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getProficienciesTemplate');
        return { success: true, template: DEFAULT_TEXT_ADVENTURE_PROFICIENCIES_TEMPLATE };
    }

    getStatusesTemplate (): StatusesTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getStatusesTemplate');
        return { success: true, template: DEFAULT_TEXT_ADVENTURE_STATUSES_TEMPLATE };
    }

    getCharactersTemplate (): CharactersTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getCharactersTemplate');
        return { success: true, template: DEFAULT_TEXT_ADVENTURE_CHARACTERS_TEMPLATE };
    }
}

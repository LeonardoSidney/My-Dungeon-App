import {
    DEFAULT_AI_CHARACTER_INSTRUCTION_TEMPLATE,
    DEFAULT_CHARACTER_MESSAGE_TEMPLATE,
    DEFAULT_CONTEXT_INSTRUCTION_TEMPLATE,
    DEFAULT_CONTEXT_MESSAGE_TEMPLATE,
    DEFAULT_INSTRUCTIONS_MESSAGE_TEMPLATE,
    DEFAULT_MESSAGE_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_ABILITIES_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_CHARACTERS_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_IA_CONTROLLED_CHARACTER_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_ITEMS_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_LOCATIONS_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_PROFICIENCIES_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_STATUSES_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_SYSTEM_PROMPT_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_WORLD_MASTER_TEMPLATE,
    DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE,
    DEFAULT_TURN_MESSAGE_TEMPLATE,
    DEFAULT_WORLD_MASTER_INSTRUCTION_TEMPLATE,
} from '@domain/constants/textGeneration';
import { ILogger } from '@domain/logger';
import {
    AbilitiesTemplateServiceResponse,
    CharactersTemplateServiceResponse,
    IaControlledCharacterTemplateServiceResponse,
    ItemsTemplateServiceResponse,
    LocationsTemplateServiceResponse,
    ProficienciesTemplateServiceResponse,
    StatusesTemplateServiceResponse,
    SystemPromptTemplateServiceResponse,
    ITextGenerationTemplatesService,
    WorldMasterTemplateServiceResponse,
    WorldsTemplateServiceResponse,
    MessageTemplateServiceResponse,
    ContextMessageTemplateServiceResponse,
    TurnMessageTemplateServiceResponse,
    CharacterMessageTemplateServiceResponse,
    InstructionsMessageTemplateServiceResponse,
    AiCharacterInstructionTemplateServiceResponse,
    WorldMasterInstructionTemplateServiceResponse,
    ContextInstructionTemplateServiceResponse,
} from '@domain/services';

export class TextGenerationTemplatesService implements ITextGenerationTemplatesService {
    constructor (
        private readonly logger: ILogger
    ) { }

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

    getMessageTemplate (): MessageTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getMessageTemplate');
        return { success: true, template: DEFAULT_MESSAGE_TEMPLATE };
    }

    getContextMessageTemplate (): ContextMessageTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getContextMessageTemplate');
        return { success: true, template: DEFAULT_CONTEXT_MESSAGE_TEMPLATE };
    }

    getTurnMessageTemplate (): TurnMessageTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getTurnMessageTemplate');
        return { success: true, template: DEFAULT_TURN_MESSAGE_TEMPLATE };
    }

    getCharacterMessageTemplate (): CharacterMessageTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getCharacterMessageTemplate');
        return { success: true, template: DEFAULT_CHARACTER_MESSAGE_TEMPLATE };
    }

    getInstructionsMessageTemplate (): InstructionsMessageTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getInstructionsMessageTemplate');
        return { success: true, template: DEFAULT_INSTRUCTIONS_MESSAGE_TEMPLATE };
    }

    getAiCharacterInstructionTemplate (): AiCharacterInstructionTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getAiCharacterInstructionTemplate');
        return { success: true, template: DEFAULT_AI_CHARACTER_INSTRUCTION_TEMPLATE };
    }

    getWorldMasterInstructionTemplate (): WorldMasterInstructionTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getWorldMasterInstructionTemplate');
        return { success: true, template: DEFAULT_WORLD_MASTER_INSTRUCTION_TEMPLATE };
    }

    getContextInstructionTemplate (): ContextInstructionTemplateServiceResponse {
        this.logger.info('Executing TextGenerationTemplatesService::getContextInstructionTemplate');
        return { success: true, template: DEFAULT_CONTEXT_INSTRUCTION_TEMPLATE };
    }
}

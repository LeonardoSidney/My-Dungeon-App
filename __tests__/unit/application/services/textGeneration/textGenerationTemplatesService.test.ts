import { TextGenerationTemplatesService } from '@application/services/textGeneration';
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

const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    log: jest.fn()
};

describe('TextGenerationTemplatesService', () => {
    let service: TextGenerationTemplatesService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new TextGenerationTemplatesService(
            mockLogger as unknown as ILogger
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    const defaultTemplates: Array<{
        name: string;
        run: () => { success: boolean; template?: string; error?: string; };
        expected: string;
    }> = [
        { name: 'getSystemPromptTemplate', run: () => service.getSystemPromptTemplate(), expected: DEFAULT_TEXT_ADVENTURE_SYSTEM_PROMPT_TEMPLATE },
        { name: 'getWorldMasterTemplate', run: () => service.getWorldMasterTemplate(), expected: DEFAULT_TEXT_ADVENTURE_WORLD_MASTER_TEMPLATE },
        { name: 'getIaControlledCharacterTemplate', run: () => service.getIaControlledCharacterTemplate(), expected: DEFAULT_TEXT_ADVENTURE_IA_CONTROLLED_CHARACTER_TEMPLATE },
        { name: 'getWorldsTemplate', run: () => service.getWorldsTemplate(), expected: DEFAULT_TEXT_ADVENTURE_WORLDS_TEMPLATE },
        { name: 'getLocationsTemplate', run: () => service.getLocationsTemplate(), expected: DEFAULT_TEXT_ADVENTURE_LOCATIONS_TEMPLATE },
        { name: 'getItemsTemplate', run: () => service.getItemsTemplate(), expected: DEFAULT_TEXT_ADVENTURE_ITEMS_TEMPLATE },
        { name: 'getAbilitiesTemplate', run: () => service.getAbilitiesTemplate(), expected: DEFAULT_TEXT_ADVENTURE_ABILITIES_TEMPLATE },
        { name: 'getProficienciesTemplate', run: () => service.getProficienciesTemplate(), expected: DEFAULT_TEXT_ADVENTURE_PROFICIENCIES_TEMPLATE },
        { name: 'getStatusesTemplate', run: () => service.getStatusesTemplate(), expected: DEFAULT_TEXT_ADVENTURE_STATUSES_TEMPLATE },
        { name: 'getCharactersTemplate', run: () => service.getCharactersTemplate(), expected: DEFAULT_TEXT_ADVENTURE_CHARACTERS_TEMPLATE }
    ];

    it.each(defaultTemplates)('should return the default template from $name', ({ run, expected }) => {
        const result = run();

        expect(result.success).toBe(true);
        expect(result.template).toBe(expected);
    });

    it('should log the method execution', () => {
        service.getAbilitiesTemplate();

        expect(mockLogger.info).toHaveBeenCalledWith('Executing TextGenerationTemplatesService::getAbilitiesTemplate');
    });

    it('should return the default user message template', () => {
        const result = service.getMessageTemplate();

        expect(result).toEqual({ success: true, template: DEFAULT_MESSAGE_TEMPLATE });
    });

    it('should return the default context message template', () => {
        const result = service.getContextMessageTemplate();

        expect(result).toEqual({ success: true, template: DEFAULT_CONTEXT_MESSAGE_TEMPLATE });
    });

    it('should return the default turn message template', () => {
        const result = service.getTurnMessageTemplate();

        expect(result).toEqual({ success: true, template: DEFAULT_TURN_MESSAGE_TEMPLATE });
    });

    it('should return the default character message template', () => {
        const result = service.getCharacterMessageTemplate();

        expect(result).toEqual({ success: true, template: DEFAULT_CHARACTER_MESSAGE_TEMPLATE });
    });

    it('should return the default instructions message template', () => {
        const result = service.getInstructionsMessageTemplate();

        expect(result).toEqual({ success: true, template: DEFAULT_INSTRUCTIONS_MESSAGE_TEMPLATE });
    });

    it('should return the default AI character instruction template', () => {
        const result = service.getAiCharacterInstructionTemplate();

        expect(result).toEqual({ success: true, template: DEFAULT_AI_CHARACTER_INSTRUCTION_TEMPLATE });
    });

    it('should return the default world master instruction template', () => {
        const result = service.getWorldMasterInstructionTemplate();

        expect(result).toEqual({ success: true, template: DEFAULT_WORLD_MASTER_INSTRUCTION_TEMPLATE });
    });

    it('should return the default context instruction template', () => {
        const result = service.getContextInstructionTemplate();

        expect(result).toEqual({ success: true, template: DEFAULT_CONTEXT_INSTRUCTION_TEMPLATE });
    });
});

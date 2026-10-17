import { TextGenerationTemplatesService } from '@application/services/textGeneration';
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

const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warning: jest.fn(),
    debug: jest.fn(),
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
        { name: 'getRootTemplate', run: () => service.getRootTemplate(), expected: DEFAULT_TEXT_ADVENTURE_TEMPLATE },
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
});

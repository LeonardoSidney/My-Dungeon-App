import { TextGeneration } from '@infra/providers/textGeneration';
import { ILogger } from '@domain/logger';
import { ITextGenerationTemplatesService } from '@domain/services';
import { HydratedCharacter } from '@domain/use-cases';
import {
    createAbilityHelper,
    createCharacterHelper,
    createHydratedAdventureHelper,
    createItemHelper,
    createLocationHelper,
    createProficiencyHelper,
    createStatusHelper,
    createSystemPromptHelper,
    createWorldHelper,
    createWorldMasterHelper,
} from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const TEMPLATES = {
    getRootTemplate: '{systemPrompt}|{worldMaster}|{characterAsWorldMaster}|{worlds}|{locations}|{items}|{abilities}|{proficiencies}|{statuses}|{characters}',
    getSystemPromptTemplate: 'SP<{systemPrompt}>',
    getWorldMasterTemplate: 'WM<{worldMaster}>',
    getIaControlledCharacterTemplate: 'IA<{characterAsWorldMaster}>',
    getWorldsTemplate: 'WORLDS<{worlds}>',
    getLocationsTemplate: 'LOCATIONS<{locations}>',
    getItemsTemplate: 'ITEMS<{items}>',
    getAbilitiesTemplate: 'ABILITIES<{abilities}>',
    getProficienciesTemplate: 'PROFICIENCIES<{proficiencies}>',
    getStatusesTemplate: 'STATUSES<{statuses}>',
    getCharactersTemplate: 'CHARACTERS<{characters}>'
};

type TemplateMethod = keyof typeof TEMPLATES;

function buildTemplatesService (): Record<TemplateMethod, jest.Mock> {
    return Object.fromEntries(
        Object.entries(TEMPLATES).map(([method, template]) => [method, jest.fn().mockReturnValue({ success: true, template })])
    ) as Record<TemplateMethod, jest.Mock>;
}

function buildTextGeneration (templatesService = buildTemplatesService()): TextGeneration {
    return new TextGeneration(mockLogger, templatesService as unknown as ITextGenerationTemplatesService);
}

const fireball = createAbilityHelper({ id: 'ability-1', name: 'Fireball', prompt: 'Throws fire' });
const swords = createProficiencyHelper({ id: 'proficiency-1', name: 'Swords', prompt: 'Fights with swords' });
const healthy = createStatusHelper({ id: 'status-1', name: 'Healthy', prompt: 'Feels fine' });

function character (overrides: Partial<HydratedCharacter>): HydratedCharacter {
    return {
        ...createCharacterHelper({ name: overrides.name, prompt: overrides.prompt }),
        abilities: [],
        proficiencies: [],
        statuses: [],
        worldMaster: false,
        aiControlled: false,
        ...overrides
    };
}

describe('TextGeneration', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('buildAdventureTextSystemPrompt', () => {
        it('fills every template with the hydrated adventure and joins them into the root template', () => {
            const hydrated = {
                ...createHydratedAdventureHelper({
                    worldMaster: createWorldMasterHelper({ prompt: 'Master prompt' }),
                    characters: [
                        character({ name: 'Narrator', prompt: 'Narrator prompt', worldMaster: true, abilities: [fireball] }),
                        character({ name: 'Hero', prompt: 'Hero prompt', abilities: [fireball], proficiencies: [swords], statuses: [healthy] }),
                        character({ name: 'Npc', prompt: 'Npc prompt', aiControlled: true })
                    ]
                }),
                systemPrompts: [createSystemPromptHelper({ content: 'Rules' }), createSystemPromptHelper({ content: 'More rules' })],
                worlds: [createWorldHelper({ name: 'Aether', prompt: 'World prompt' })],
                locations: [createLocationHelper({ name: 'Tavern', prompt: 'Location prompt' })],
                items: [createItemHelper({ name: 'Sword', prompt: 'Item prompt' })]
            };

            const result = buildTextGeneration().buildAdventureTextSystemPrompt(hydrated);

            expect(result.success).toBe(true);
            expect(result.systemPrompt?.split('|')).toEqual([
                'SP<Rules\nMore rules\n>',
                'WM<Master prompt>',
                'IA<## NARRATOR\nNarrator prompt\n### ABILITIES\n- **Fireball**\n\n>',
                'WORLDS<## AETHER\nWorld prompt\n>',
                'LOCATIONS<## TAVERN\nLocation prompt\n>',
                'ITEMS<## SWORD\nItem prompt\n>',
                'ABILITIES<## FIREBALL\nThrows fire\n>',
                'PROFICIENCIES<## SWORDS\nFights with swords\n>',
                'STATUSES<## HEALTHY\nFeels fine\n>',
                'CHARACTERS<## HERO\nHero prompt\n'
                    + '### ABILITIES\n- **Fireball**\n\n'
                    + '### PROFICIENCIES\n- **Swords**\n\n'
                    + '### STATUSES\n- **Healthy**\n\n'
                    + '## NPC\nNpc prompt\n>'
            ]);
        });

        it('leaves the optional sections empty when the adventure has nothing to fill them', () => {
            const hydrated = {
                ...createHydratedAdventureHelper({ withoutWorldMaster: true, characters: [] }),
                systemPrompts: [],
                worlds: [],
                locations: [],
                items: []
            };

            const result = buildTextGeneration().buildAdventureTextSystemPrompt(hydrated);

            expect(result).toEqual({ success: true, systemPrompt: 'SP<>|||||||||CHARACTERS<>' });
        });

        it('keeps the world master section with an empty prompt', () => {
            const hydrated = createHydratedAdventureHelper({ worldMaster: createWorldMasterHelper({ prompt: '' }) });

            const sections = buildTextGeneration().buildAdventureTextSystemPrompt(hydrated).systemPrompt?.split('|');

            expect(sections?.[1]).toBe('WM<>');
        });

        it('lists a trait shared by several characters only once', () => {
            const hydrated = createHydratedAdventureHelper({
                characters: [
                    character({ name: 'Hero', proficiencies: [swords], statuses: [healthy] }),
                    character({ name: 'Ally', proficiencies: [swords], statuses: [healthy] })
                ]
            });

            const sections = buildTextGeneration().buildAdventureTextSystemPrompt(hydrated).systemPrompt?.split('|');

            expect(sections?.[7]).toBe('PROFICIENCIES<## SWORDS\nFights with swords\n>');
            expect(sections?.[8]).toBe('STATUSES<## HEALTHY\nFeels fine\n>');
        });

        it.each([
            [{ success: false, error: 'Template file missing' }, 'Template file missing'],
            [{ success: false }, 'Text generation template not found: worlds'],
            [{ success: true }, 'Text generation template not found: worlds']
        ])('fails when a template answers %j', (templateResponse, error) => {
            const templatesService = buildTemplatesService();
            templatesService.getWorldsTemplate.mockReturnValue(templateResponse);

            const result = buildTextGeneration(templatesService).buildAdventureTextSystemPrompt(createHydratedAdventureHelper());

            expect(result).toEqual({ success: false, error });
            expect(mockLogger.warning).toHaveBeenCalled();
        });
    });
});

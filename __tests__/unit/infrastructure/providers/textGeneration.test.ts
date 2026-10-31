import { TextGeneration } from '@infra/providers/textGeneration';
import {
    DEFAULT_AI_CHARACTER_INSTRUCTION_TEMPLATE,
    DEFAULT_CHARACTER_MESSAGE_TEMPLATE,
    DEFAULT_CONTEXT_INSTRUCTION_TEMPLATE,
    DEFAULT_CONTEXT_MESSAGE_TEMPLATE,
    DEFAULT_INSTRUCTIONS_MESSAGE_TEMPLATE,
    DEFAULT_MESSAGE_TEMPLATE,
    DEFAULT_TURN_MESSAGE_TEMPLATE,
    DEFAULT_WORLD_MASTER_INSTRUCTION_TEMPLATE,
} from '@domain/constants/textGeneration';
import { RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { AdventureTemplates, BuildAdventureTurnMessagesParams, TurnPromptPurposeEnum, TurnMessageTemplates } from '@domain/providers';
import { TurnSpeaker, TurnSpeakerKindEnum } from '@domain/services';
import { HydratedAdventure, HydratedCharacter } from '@domain/use-cases';
import {
    createAbilityHelper,
    createCharacterHelper,
    createChatHelper,
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
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const LOAD_ORDER = '{systemPrompt}|{worldMaster}|{characterAsWorldMaster}|{worlds}|{locations}|{items}|{abilities}|{proficiencies}|{statuses}|{characters}';

const ADVENTURE_TEMPLATES: AdventureTemplates = {
    systemPrompt: 'SP<{systemPrompt}>',
    worldMaster: 'WM<{worldMaster}>',
    iaControlledCharacter: 'IA<{characterAsWorldMaster}>',
    worlds: 'WORLDS<{worlds}>',
    locations: 'LOCATIONS<{locations}>',
    items: 'ITEMS<{items}>',
    abilities: 'ABILITIES<{abilities}>',
    proficiencies: 'PROFICIENCIES<{proficiencies}>',
    statuses: 'STATUSES<{statuses}>',
    characters: 'CHARACTERS<{characters}>'
};

const TURN_TEMPLATES: TurnMessageTemplates = {
    message: DEFAULT_MESSAGE_TEMPLATE,
    contextMessage: DEFAULT_CONTEXT_MESSAGE_TEMPLATE,
    turnMessage: DEFAULT_TURN_MESSAGE_TEMPLATE,
    characterMessage: DEFAULT_CHARACTER_MESSAGE_TEMPLATE,
    instructionsMessage: DEFAULT_INSTRUCTIONS_MESSAGE_TEMPLATE,
    aiCharacterInstruction: DEFAULT_AI_CHARACTER_INSTRUCTION_TEMPLATE,
    worldMasterInstruction: DEFAULT_WORLD_MASTER_INSTRUCTION_TEMPLATE,
    contextInstruction: DEFAULT_CONTEXT_INSTRUCTION_TEMPLATE
};

function buildSystemPrompt (hydrated: HydratedAdventure, loadOrder: string, templates = ADVENTURE_TEMPLATES) {
    return new TextGeneration(mockLogger).buildAdventureTextSystemPrompt(hydrated, loadOrder, templates);
}

function buildTurnMessages (params: BuildAdventureTurnMessagesParams, templates = TURN_TEMPLATES) {
    return new TextGeneration(mockLogger).buildAdventureTurnMessages(params, templates);
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

            const result = buildSystemPrompt(hydrated, LOAD_ORDER);

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

            const result = buildSystemPrompt(hydrated, LOAD_ORDER);

            expect(result).toEqual({ success: true, systemPrompt: 'SP<>|||||||||CHARACTERS<>' });
        });

        it('keeps the world master section with an empty prompt', () => {
            const hydrated = createHydratedAdventureHelper({ worldMaster: createWorldMasterHelper({ prompt: '' }) });

            const sections = buildSystemPrompt(hydrated, LOAD_ORDER).systemPrompt?.split('|');

            expect(sections?.[1]).toBe('WM<>');
        });

        it('lists a trait shared by several characters only once', () => {
            const hydrated = createHydratedAdventureHelper({
                characters: [
                    character({ name: 'Hero', proficiencies: [swords], statuses: [healthy] }),
                    character({ name: 'Ally', proficiencies: [swords], statuses: [healthy] })
                ]
            });

            const sections = buildSystemPrompt(hydrated, LOAD_ORDER).systemPrompt?.split('|');

            expect(sections?.[7]).toBe('PROFICIENCIES<## SWORDS\nFights with swords\n>');
            expect(sections?.[8]).toBe('STATUSES<## HEALTHY\nFeels fine\n>');
        });

        describe('load order', () => {
            const hydrated = {
                ...createHydratedAdventureHelper({
                    worldMaster: createWorldMasterHelper({ prompt: 'Master prompt' }),
                    characters: [character({ name: 'Hero', prompt: 'Hero prompt' })]
                }),
                systemPrompts: [createSystemPromptHelper({ content: 'Rules' })],
                worlds: [createWorldHelper({ name: 'Aether', prompt: 'World prompt' })]
            };

            it('injects the sections in the order of the load order', () => {
                const result = buildSystemPrompt(hydrated, '{characters}|{worlds}|{systemPrompt}');

                expect(result).toEqual({
                    success: true,
                    systemPrompt: 'CHARACTERS<## HERO\nHero prompt\n>|WORLDS<## AETHER\nWorld prompt\n>|SP<Rules\n>'
                });
            });

            it('leaves out the sections whose tags were removed', () => {
                const result = buildSystemPrompt(hydrated, '{systemPrompt}|{characters}');

                expect(result.systemPrompt).toBe('SP<Rules\n>|CHARACTERS<## HERO\nHero prompt\n>');
                expect(result.systemPrompt).not.toContain('Master prompt');
                expect(result.systemPrompt).not.toContain('World prompt');
            });

            describe('character references', () => {
                const referencesHydrated = createHydratedAdventureHelper({
                    characters: [
                        character({
                            name: 'Narrator',
                            prompt: 'Narrator prompt',
                            worldMaster: true,
                            abilities: [fireball],
                            proficiencies: [swords],
                            statuses: [healthy]
                        }),
                        character({ name: 'Hero', prompt: 'Hero prompt', abilities: [fireball], proficiencies: [swords], statuses: [healthy] })
                    ]
                });
                const abilitiesReference = '### ABILITIES\n- **Fireball**\n\n';
                const proficienciesReference = '### PROFICIENCIES\n- **Swords**\n\n';
                const statusesReference = '### STATUSES\n- **Healthy**\n\n';

                function buildSections (loadOrder: string) {
                    const systemPrompt = buildSystemPrompt(referencesHydrated, loadOrder).systemPrompt ?? '';
                    const [iaControlledCharacter, characters] = systemPrompt.split('|');
                    return { iaControlledCharacter, characters };
                }

                it('lists every reference when all of their tags are in the load order', () => {
                    const sections = buildSections('{characterAsWorldMaster}|{characters}{abilities}{proficiencies}{statuses}');

                    for (const section of [sections.iaControlledCharacter, sections.characters]) {
                        expect(section).toContain(abilitiesReference);
                        expect(section).toContain(proficienciesReference);
                        expect(section).toContain(statusesReference);
                    }
                });

                it('lists no reference when none of their tags is in the load order', () => {
                    const sections = buildSections('{characterAsWorldMaster}|{characters}');

                    expect(sections.iaControlledCharacter).toBe('IA<## NARRATOR\nNarrator prompt\n>');
                    expect(sections.characters).toBe('CHARACTERS<## HERO\nHero prompt\n>');
                });

                it.each([
                    ['{abilities}', abilitiesReference, [proficienciesReference, statusesReference]],
                    ['{proficiencies}', proficienciesReference, [abilitiesReference, statusesReference]],
                    ['{statuses}', statusesReference, [abilitiesReference, proficienciesReference]],
                ])('lists only the %s references when only that tag is in the load order', (tag, kept, removed) => {
                    const sections = buildSections(`{characterAsWorldMaster}|{characters}${tag}`);

                    for (const section of [sections.iaControlledCharacter, sections.characters]) {
                        expect(section).toContain(kept);
                        for (const reference of removed) {
                            expect(section).not.toContain(reference);
                        }
                    }
                });
            });

            it('injects nothing when the load order is empty', () => {
                const result = buildSystemPrompt(hydrated, '');

                expect(result).toEqual({ success: true, systemPrompt: '' });
            });

            it('keeps a tag it does not know', () => {
                const result = buildSystemPrompt(hydrated, '{systemPrompt}|{unknown}');

                expect(result.systemPrompt).toBe('SP<Rules\n>|{unknown}');
            });
        });

        describe('text written by the player', () => {
            function buildWithRules (rules: string): string | undefined {
                const hydrated = {
                    ...createHydratedAdventureHelper({ characters: [character({ name: 'Hero', prompt: 'Hero prompt' })] }),
                    systemPrompts: [createSystemPromptHelper({ content: rules })],
                };

                return buildSystemPrompt(hydrated, '{systemPrompt}|{characters}').systemPrompt;
            }

            it('keeps a dollar sign followed by a quote as written', () => {
                expect(buildWithRules('Prices look like $\' here')).toBe('SP<Prices look like $\' here\n>|CHARACTERS<## HERO\nHero prompt\n>');
            });

            it('keeps a dollar sign followed by a backtick as written', () => {
                expect(buildWithRules('Prices look like $` here')).toBe('SP<Prices look like $` here\n>|CHARACTERS<## HERO\nHero prompt\n>');
            });

            it('keeps a dollar sign followed by an ampersand as written', () => {
                expect(buildWithRules('Prices look like $& here')).toBe('SP<Prices look like $& here\n>|CHARACTERS<## HERO\nHero prompt\n>');
            });

            it('keeps a double dollar sign as written', () => {
                expect(buildWithRules('Costs $$100')).toBe('SP<Costs $$100\n>|CHARACTERS<## HERO\nHero prompt\n>');
            });

            it('keeps a tag written inside a section without filling it', () => {
                expect(buildWithRules('Use {characters} sparingly')).toBe('SP<Use {characters} sparingly\n>|CHARACTERS<## HERO\nHero prompt\n>');
            });
        });

        it('fills every occurrence of a tag repeated in a section template', () => {
            const hydrated = { ...createHydratedAdventureHelper(), worlds: [createWorldHelper({ name: 'Aether', prompt: 'World prompt' })] };
            const templates = { ...ADVENTURE_TEMPLATES, worlds: '{worlds}/{worlds}' };

            const result = buildSystemPrompt(hydrated, '{worlds}', templates);

            expect(result.systemPrompt).toBe('## AETHER\nWorld prompt\n/## AETHER\nWorld prompt\n');
        });
    });

    describe('buildAdventureTurnMessages', () => {
        const swordsman = character({ id: 'swordsman', name: 'Swordsman' });
        const mage = character({ id: 'mage', name: 'Mage' });
        const cleric = character({ id: 'cleric', name: 'Cleric', aiControlled: true });
        const clericSpeaker: TurnSpeaker = {
            kind: TurnSpeakerKindEnum.AI_CHARACTER,
            role: RoleEnum.AI_PERSONA,
            characterId: 'cleric',
            name: 'Cleric',
            assistantId: '1'
        };
        const worldMasterSpeaker: TurnSpeaker = {
            kind: TurnSpeakerKindEnum.WORLD_MASTER,
            role: RoleEnum.ASSISTANT,
            characterId: 'master',
            name: 'Master',
            assistantId: '1'
        };
        const clericInstruction = '<instruction>\nRespond and act only as Cleric. Do not write lines or actions for any other character.\n</instruction>';

        function hydratedWithChat (chat: ReturnType<typeof createChatHelper>[]) {
            return createHydratedAdventureHelper({ adventure: { chat }, characters: [swordsman, mage, cleric] });
        }

        it('sends the current turn and the instruction of the AI character as one user message', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['I draw my sword'] }),
                createChatHelper({ id: 'chat-2', characterId: 'mage', content: ['I cast a light'] })
            ]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result).toEqual({
                success: true,
                messages: [{
                    role: RoleEnum.USER,
                    content: '\n<turn_chat_content>\n'
                        + '<message character="Swordsman">\nI draw my sword\n</message>\n'
                        + '<message character="Mage">\nI cast a light\n</message>\n'
                        + '</turn_chat_content>\n'
                        + clericInstruction
                }]
            });
        });

        it('puts the context before the current turn when one is given', () => {
            const hydrated = hydratedWithChat([createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] })]);

            const result = buildTurnMessages({
                hydrated,
                speaker: clericSpeaker,
                purpose: TurnPromptPurposeEnum.REPLY,
                context: 'The party is in a dark cave'
            });

            expect(result.messages?.[0].content).toBe(
                '<context>\nThe party is in a dark cave\n</context>\n'
                    + '<turn_chat_content>\n<message character="Swordsman">\nHello\n</message>\n</turn_chat_content>\n'
                    + clericInstruction
            );
        });

        it('leaves the context out when the given context is blank', () => {
            const hydrated = hydratedWithChat([createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] })]);

            const result = buildTurnMessages({
                hydrated,
                speaker: clericSpeaker,
                purpose: TurnPromptPurposeEnum.REPLY,
                context: '   '
            });

            expect(result.messages?.[0].content).not.toContain('<context>');
        });

        it('sends the world master instruction when the world master speaks', () => {
            const hydrated = hydratedWithChat([createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] })]);

            const result = buildTurnMessages({ hydrated, speaker: worldMasterSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.[0].content).toContain(
                `<instruction>\n${DEFAULT_WORLD_MASTER_INSTRUCTION_TEMPLATE.split('{characterName}').join('Master')}\n</instruction>`
            );
        });

        it('asks for the context of the speaker without a context block when the purpose is the context', () => {
            const hydrated = hydratedWithChat([createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] })]);

            const result = buildTurnMessages({
                hydrated,
                speaker: clericSpeaker,
                purpose: TurnPromptPurposeEnum.CONTEXT,
                context: 'ignored context'
            });

            expect(result.messages?.[0].content).toBe(
                '\n<turn_chat_content>\n<message character="Swordsman">\nHello\n</message>\n</turn_chat_content>\n'
                    + `<instruction>\n${DEFAULT_CONTEXT_INSTRUCTION_TEMPLATE.split('{characterName}').join('Cleric')}\n</instruction>`
            );
        });

        it('sends each past turn as only its turn content followed by the world master message', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['First line'] }),
                createChatHelper({ id: 'chat-2', role: RoleEnum.AI_PERSONA, characterId: 'cleric', content: ['Cleric line'] }),
                createChatHelper({ id: 'chat-3', role: RoleEnum.ASSISTANT, characterId: 'master', content: ['Outcome'] }),
                createChatHelper({ id: 'chat-4', characterId: 'swordsman', content: ['Second line'] })
            ]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.slice(0, 2)).toEqual([
                {
                    role: RoleEnum.USER,
                    content: '<turn_chat_content>\n'
                        + '<message character="Swordsman">\nFirst line\n</message>\n'
                        + '<message character="Cleric">\nCleric line\n</message>\n'
                        + '</turn_chat_content>'
                },
                { role: RoleEnum.ASSISTANT, content: 'Outcome' }
            ]);
            expect(result.messages?.[2].content).toContain('<message character="Swordsman">\nSecond line\n</message>');
        });

        it('sends the selected content version of each turn message', () => {
            const hydrated = hydratedWithChat([createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['old', 'new'], index: 1 })]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.[0].content).toContain('<message character="Swordsman">\nnew\n</message>');
        });

        it('sends a turn message without text when its selected content version does not exist', () => {
            const hydrated = hydratedWithChat([createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['only'], index: 1 })]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.[0].content).toContain('<message character="Swordsman">\n\n</message>');
        });

        it('sends no empty turn before a world master message that opens the adventure', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', role: RoleEnum.ASSISTANT, characterId: 'master', content: ['Opening'] }),
                createChatHelper({ id: 'chat-2', characterId: 'swordsman', content: ['Hello'] })
            ]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.map(message => message.role)).toEqual([RoleEnum.ASSISTANT, RoleEnum.USER]);
            expect(result.messages?.[0].content).toBe('Opening');
        });

        it('does not send the thought of an AI character inside the turn content', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({
                    id: 'chat-1',
                    role: RoleEnum.AI_PERSONA,
                    characterId: 'cleric',
                    content: ['I pray'],
                    think: [{ id: 'think-1', content: 'secret thought', enabled: true }]
                })
            ]);

            const result = buildTurnMessages({ hydrated, speaker: worldMasterSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages).toHaveLength(1);
            expect(result.messages?.[0].content).not.toContain('secret thought');
        });

        it('sends the enabled thought of a past world master message as its reasoning', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] }),
                createChatHelper({
                    id: 'chat-2',
                    role: RoleEnum.ASSISTANT,
                    characterId: 'master',
                    content: ['Outcome'],
                    think: [{ id: 'think-1', content: 'master thought', enabled: true }]
                })
            ]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.[1]).toEqual({ role: RoleEnum.ASSISTANT, content: 'Outcome', reasoning: 'master thought' });
        });

        it('does not send a disabled thought of a past world master message', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] }),
                createChatHelper({
                    id: 'chat-2',
                    role: RoleEnum.ASSISTANT,
                    characterId: 'master',
                    content: ['Outcome'],
                    think: [{ id: 'think-1', content: 'hidden thought', enabled: false }]
                })
            ]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.[1]).toEqual({ role: RoleEnum.ASSISTANT, content: 'Outcome' });
        });

        it('does not send a blank thought of a past world master message', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] }),
                createChatHelper({
                    id: 'chat-2',
                    role: RoleEnum.ASSISTANT,
                    characterId: 'master',
                    content: ['Outcome'],
                    think: [{ id: 'think-1', content: '   ', enabled: true }]
                })
            ]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.[1]).toEqual({ role: RoleEnum.ASSISTANT, content: 'Outcome' });
        });

        it('sends the thought at the think index of a past world master message', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] }),
                createChatHelper({
                    id: 'chat-2',
                    role: RoleEnum.ASSISTANT,
                    characterId: 'master',
                    index: 0,
                    thinkIndex: 1,
                    content: ['old answer', 'new answer'],
                    think: [
                        { id: 'think-0', content: 'old reasoning', enabled: true },
                        { id: 'think-1', content: 'new reasoning', enabled: true }
                    ]
                })
            ]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.[1]).toEqual({ role: RoleEnum.ASSISTANT, content: 'old answer', reasoning: 'new reasoning' });
        });

        it('keeps a past world master message without content when it has reasoning', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] }),
                createChatHelper({
                    id: 'chat-2',
                    role: RoleEnum.ASSISTANT,
                    characterId: 'master',
                    content: [''],
                    think: [{ id: 'think-1', content: 'reasoning', enabled: true }]
                })
            ]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.[1]).toEqual({ role: RoleEnum.ASSISTANT, content: '', reasoning: 'reasoning' });
        });

        it('skips a past world master message without content nor reasoning', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] }),
                createChatHelper({ id: 'chat-2', role: RoleEnum.ASSISTANT, characterId: 'master', content: ['  '] })
            ]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.map(message => message.role)).toEqual([RoleEnum.USER, RoleEnum.USER]);
        });

        it('skips a past world master message whose selected content version does not exist', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] }),
                createChatHelper({ id: 'chat-2', role: RoleEnum.ASSISTANT, characterId: 'master', content: ['only'], index: 1 })
            ]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.map(message => message.role)).toEqual([RoleEnum.USER, RoleEnum.USER]);
        });

        it('sends the target chat as the assistant message to continue and only the messages before it in the turn', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] }),
                createChatHelper({
                    id: 'chat-2',
                    role: RoleEnum.AI_PERSONA,
                    characterId: 'cleric',
                    content: ['I start to'],
                    think: [{ id: 'think-1', content: 'cleric thought', enabled: true }]
                }),
                createChatHelper({ id: 'chat-3', characterId: 'mage', content: ['After the target'] })
            ]);

            const result = buildTurnMessages({
                hydrated,
                speaker: clericSpeaker,
                purpose: TurnPromptPurposeEnum.REPLY,
                targetChatId: 'chat-2'
            });

            expect(result.messages).toEqual([
                {
                    role: RoleEnum.USER,
                    content: '\n<turn_chat_content>\n<message character="Swordsman">\nHello\n</message>\n</turn_chat_content>\n' + clericInstruction
                },
                { role: RoleEnum.ASSISTANT, content: 'I start to', reasoning: 'cleric thought' }
            ]);
        });

        it('does not send an assistant message for an empty target chat', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] }),
                createChatHelper({ id: 'chat-2', role: RoleEnum.AI_PERSONA, characterId: 'cleric', content: [''] })
            ]);

            const result = buildTurnMessages({
                hydrated,
                speaker: clericSpeaker,
                purpose: TurnPromptPurposeEnum.REPLY,
                targetChatId: 'chat-2'
            });

            expect(result.messages?.map(message => message.role)).toEqual([RoleEnum.USER]);
        });

        it('does not send the target chat when the purpose is the context', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] }),
                createChatHelper({ id: 'chat-2', role: RoleEnum.AI_PERSONA, characterId: 'cleric', content: ['I start to'] })
            ]);

            const result = buildTurnMessages({
                hydrated,
                speaker: clericSpeaker,
                purpose: TurnPromptPurposeEnum.CONTEXT,
                targetChatId: 'chat-2'
            });

            expect(result.messages?.map(message => message.role)).toEqual([RoleEnum.USER]);
        });

        it('fails when the target chat is not in the adventure', () => {
            const hydrated = hydratedWithChat([createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] })]);

            const result = buildTurnMessages({
                hydrated,
                speaker: clericSpeaker,
                purpose: TurnPromptPurposeEnum.REPLY,
                targetChatId: 'missing'
            });

            expect(result).toEqual({ success: false, error: 'Chat with id missing was not found' });
        });

        it('names a message of a character that is no longer in the adventure as unknown', () => {
            const hydrated = hydratedWithChat([createChatHelper({ id: 'chat-1', characterId: 'removed', content: ['Hello'] })]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.[0].content).toContain('<message character="Unknown">\nHello\n</message>');
        });

        it('keeps a tag written by the player as written', () => {
            const hydrated = hydratedWithChat([createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Say {characterName} and $& now'] })]);

            const result = buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(result.messages?.[0].content).toContain('<message character="Swordsman">\nSay {characterName} and $& now\n</message>');
        });

        it('logs the user message it built with its speaker and purpose', () => {
            const hydrated = hydratedWithChat([createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] })]);

            buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(mockLogger.debug).toHaveBeenCalledWith(
                'TextGeneration::buildAdventureTurnMessages - user message built',
                { speaker: 'Cleric', purpose: TurnPromptPurposeEnum.REPLY },
                '\n<turn_chat_content>\n<message character="Swordsman">\nHello\n</message>\n</turn_chat_content>\n' + clericInstruction
            );
        });

        it('logs the assistant message it will continue', () => {
            const hydrated = hydratedWithChat([
                createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] }),
                createChatHelper({ id: 'chat-2', role: RoleEnum.AI_PERSONA, characterId: 'cleric', content: ['I start to'] })
            ]);

            buildTurnMessages({
                hydrated,
                speaker: clericSpeaker,
                purpose: TurnPromptPurposeEnum.REPLY,
                targetChatId: 'chat-2'
            });

            expect(mockLogger.debug).toHaveBeenCalledWith('TextGeneration::buildAdventureTurnMessages - assistant message to continue', 'I start to');
        });

        it('does not log an assistant message to continue when there is none', () => {
            const hydrated = hydratedWithChat([createChatHelper({ id: 'chat-1', characterId: 'swordsman', content: ['Hello'] })]);

            buildTurnMessages({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

            expect(mockLogger.debug).not.toHaveBeenCalledWith('TextGeneration::buildAdventureTurnMessages - assistant message to continue', expect.anything());
        });

        it('builds the messages from the templates it receives', () => {
            const templates = { ...TURN_TEMPLATES, aiCharacterInstruction: 'Speak as {characterName} now.' };

            const result = buildTurnMessages({ hydrated: hydratedWithChat([]), speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY }, templates);

            expect(result.messages?.at(-1)?.content).toContain(`<instruction>\nSpeak as ${clericSpeaker.name} now.\n</instruction>`);
        });
    });
});

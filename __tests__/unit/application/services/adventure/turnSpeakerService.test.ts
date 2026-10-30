import { TurnSpeakerService } from '@application/services';
import { Chat, RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { HydratedAdventure, HydratedCharacter, TurnSpeakerKindEnum } from '@domain/services';
import {
    createCharacterHelper,
    createChatHelper,
    createHydratedAdventureHelper,
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

function character (overrides: Partial<HydratedCharacter>): HydratedCharacter {
    return {
        ...createCharacterHelper(),
        abilities: [],
        proficiencies: [],
        statuses: [],
        worldMaster: false,
        aiControlled: false,
        ...overrides
    };
}

const swordsman = character({ id: 'swordsman', name: 'Swordsman', assistantId: 'player-assistant' });
const mage = character({ id: 'mage', name: 'Mage', assistantId: 'player-assistant' });
const cleric = character({ id: 'cleric', name: 'Cleric', assistantId: 'cleric-assistant', aiControlled: true });
const necromancer = character({ id: 'necromancer', name: 'Necromancer', assistantId: 'necromancer-assistant', aiControlled: true });
const master = createWorldMasterHelper({ id: 'master', name: 'Master', assistantId: 'master-assistant' });

function line (id: string, characterId: string, role: RoleEnum.USER | RoleEnum.AI_PERSONA | RoleEnum.ASSISTANT = RoleEnum.USER): Chat {
    return createChatHelper({ id, characterId, role });
}

function buildHydrated (chat: Chat[]): HydratedAdventure {
    return createHydratedAdventureHelper({
        adventure: {
            chat,
            characterIds: ['swordsman', 'mage', 'cleric', 'necromancer'],
            charactersControlledByAi: ['cleric', 'necromancer'],
            worldMasterId: 'master'
        },
        characters: [swordsman, mage, cleric, necromancer],
        worldMaster: master
    });
}

describe('TurnSpeakerService', () => {
    const service = new TurnSpeakerService(mockLogger);

    describe('resolveNextSpeaker', () => {
        it('waits while the adventure has no message', () => {
            expect(service.resolveNextSpeaker(buildHydrated([]))).toEqual({ success: true });
        });

        it('waits while a player character has not spoken in the turn', () => {
            const hydrated = buildHydrated([line('chat-1', 'swordsman')]);

            expect(service.resolveNextSpeaker(hydrated)).toEqual({ success: true });
        });

        it('waits for the players again after the world master closed the turn', () => {
            const hydrated = buildHydrated([
                line('chat-1', 'swordsman'),
                line('chat-2', 'mage'),
                line('chat-3', 'cleric', RoleEnum.AI_PERSONA),
                line('chat-4', 'necromancer', RoleEnum.AI_PERSONA),
                line('chat-5', 'master', RoleEnum.ASSISTANT),
                line('chat-6', 'swordsman')
            ]);

            expect(service.resolveNextSpeaker(hydrated)).toEqual({ success: true });
        });

        it('waits for a player who has not spoken even when another player spoke twice', () => {
            const hydrated = buildHydrated([line('chat-1', 'swordsman'), line('chat-2', 'swordsman')]);

            expect(service.resolveNextSpeaker(hydrated)).toEqual({ success: true });
        });

        it('gives the turn to the first AI character once every player spoke', () => {
            const hydrated = buildHydrated([line('chat-1', 'swordsman'), line('chat-2', 'mage')]);

            expect(service.resolveNextSpeaker(hydrated)).toEqual({
                success: true,
                speaker: {
                    kind: TurnSpeakerKindEnum.AI_CHARACTER,
                    role: RoleEnum.AI_PERSONA,
                    characterId: 'cleric',
                    name: 'Cleric',
                    assistantId: 'cleric-assistant'
                }
            });
        });

        it('gives the turn to the next AI character in the controlled by AI order', () => {
            const hydrated = buildHydrated([
                line('chat-1', 'swordsman'),
                line('chat-2', 'mage'),
                line('chat-3', 'cleric', RoleEnum.AI_PERSONA)
            ]);

            expect(service.resolveNextSpeaker(hydrated).speaker?.characterId).toBe('necromancer');
        });

        it('gives the turn to the world master once every AI character spoke', () => {
            const hydrated = buildHydrated([
                line('chat-1', 'swordsman'),
                line('chat-2', 'mage'),
                line('chat-3', 'cleric', RoleEnum.AI_PERSONA),
                line('chat-4', 'necromancer', RoleEnum.AI_PERSONA)
            ]);

            expect(service.resolveNextSpeaker(hydrated)).toEqual({
                success: true,
                speaker: {
                    kind: TurnSpeakerKindEnum.WORLD_MASTER,
                    role: RoleEnum.ASSISTANT,
                    characterId: 'master',
                    name: 'Master',
                    assistantId: 'master-assistant'
                }
            });
        });

        it('counts only the AI characters that spoke after the last world master message', () => {
            const hydrated = buildHydrated([
                line('chat-1', 'cleric', RoleEnum.AI_PERSONA),
                line('chat-2', 'master', RoleEnum.ASSISTANT),
                line('chat-3', 'swordsman'),
                line('chat-4', 'mage')
            ]);

            expect(service.resolveNextSpeaker(hydrated).speaker?.characterId).toBe('cleric');
        });

        it('gives the turn to the world master when the adventure has no AI character', () => {
            const hydrated = createHydratedAdventureHelper({
                adventure: { chat: [line('chat-1', 'swordsman')], characterIds: ['swordsman'], worldMasterId: 'master' },
                characters: [swordsman],
                worldMaster: master
            });

            expect(service.resolveNextSpeaker(hydrated).speaker?.kind).toBe(TurnSpeakerKindEnum.WORLD_MASTER);
        });

        it('fails when the next AI character is not hydrated', () => {
            const hydrated = { ...buildHydrated([line('chat-1', 'swordsman'), line('chat-2', 'mage')]), characters: [swordsman, mage] };

            expect(service.resolveNextSpeaker(hydrated)).toEqual({ success: false, error: 'AI controlled character not found: cleric' });
        });

        it('keeps giving the turn to the AI characters once one spoke even when a player was skipped', () => {
            const hydrated = buildHydrated([line('chat-1', 'swordsman'), line('chat-2', 'cleric', RoleEnum.AI_PERSONA)]);

            expect(service.resolveNextSpeaker(hydrated).speaker?.characterId).toBe('necromancer');
        });

        it('gives the turn to the world master after the AI characters of a skipped player turn', () => {
            const hydrated = buildHydrated([
                line('chat-1', 'cleric', RoleEnum.AI_PERSONA),
                line('chat-2', 'necromancer', RoleEnum.AI_PERSONA)
            ]);

            expect(service.resolveNextSpeaker(hydrated).speaker?.kind).toBe(TurnSpeakerKindEnum.WORLD_MASTER);
        });
    });

    describe('resolveSkippedPlayersSpeaker', () => {
        it('gives the turn to the first AI character while no player spoke', () => {
            const hydrated = buildHydrated([line('chat-1', 'master', RoleEnum.ASSISTANT)]);

            expect(service.resolveSkippedPlayersSpeaker(hydrated)).toEqual({
                success: true,
                speaker: {
                    kind: TurnSpeakerKindEnum.AI_CHARACTER,
                    role: RoleEnum.AI_PERSONA,
                    characterId: 'cleric',
                    name: 'Cleric',
                    assistantId: 'cleric-assistant'
                }
            });
        });

        it('gives the turn to the first AI character while a player has not spoken', () => {
            const hydrated = buildHydrated([line('chat-1', 'swordsman')]);

            expect(service.resolveSkippedPlayersSpeaker(hydrated).speaker?.characterId).toBe('cleric');
        });

        it('gives the turn to the next AI character that has not spoken', () => {
            const hydrated = buildHydrated([line('chat-1', 'swordsman'), line('chat-2', 'cleric', RoleEnum.AI_PERSONA)]);

            expect(service.resolveSkippedPlayersSpeaker(hydrated).speaker?.characterId).toBe('necromancer');
        });

        it('gives the turn to the world master when the adventure has no AI character', () => {
            const hydrated = createHydratedAdventureHelper({
                adventure: { chat: [], characterIds: ['swordsman'], worldMasterId: 'master' },
                characters: [swordsman],
                worldMaster: master
            });

            expect(service.resolveSkippedPlayersSpeaker(hydrated).speaker?.kind).toBe(TurnSpeakerKindEnum.WORLD_MASTER);
        });
    });

    describe('resolveChatSpeaker', () => {
        it('resolves the AI character of an AI persona message', () => {
            const response = service.resolveChatSpeaker(buildHydrated([]), line('chat-1', 'necromancer', RoleEnum.AI_PERSONA));

            expect(response.speaker).toEqual({
                kind: TurnSpeakerKindEnum.AI_CHARACTER,
                role: RoleEnum.AI_PERSONA,
                characterId: 'necromancer',
                name: 'Necromancer',
                assistantId: 'necromancer-assistant'
            });
        });

        it('resolves the world master of an assistant message', () => {
            const response = service.resolveChatSpeaker(buildHydrated([]), line('chat-1', 'master', RoleEnum.ASSISTANT));

            expect(response.speaker?.kind).toBe(TurnSpeakerKindEnum.WORLD_MASTER);
        });

        it('fails for a message written by a player', () => {
            const response = service.resolveChatSpeaker(buildHydrated([]), line('chat-1', 'swordsman'));

            expect(response).toEqual({ success: false, error: 'Chat with id chat-1 cannot be generated from role user' });
        });
    });

    describe('resolveWorldMaster', () => {
        it('resolves the character acting as world master when there is no dedicated one', () => {
            const narrator = character({ id: 'narrator', name: 'Narrator', assistantId: 'narrator-assistant', worldMaster: true });
            const hydrated = createHydratedAdventureHelper({ characters: [swordsman, narrator], withoutWorldMaster: true });

            expect(service.resolveWorldMaster(hydrated)).toEqual({
                success: true,
                speaker: {
                    kind: TurnSpeakerKindEnum.WORLD_MASTER,
                    role: RoleEnum.ASSISTANT,
                    characterId: 'narrator',
                    name: 'Narrator',
                    assistantId: 'narrator-assistant'
                }
            });
        });

        it('fails when there is neither a world master nor a character acting as one', () => {
            const hydrated = createHydratedAdventureHelper({ characters: [swordsman], withoutWorldMaster: true });

            expect(service.resolveWorldMaster(hydrated)).toEqual({ success: false, error: 'WorldMaster not found' });
        });
    });
});

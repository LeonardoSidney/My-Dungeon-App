import { Chat, RoleEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import {
    HydratedAdventure,
    ITurnSpeakerService,
    ResolveTurnSpeakerReturn,
    TurnProgress,
    TurnSpeakerKindEnum,
} from '@domain/services';
import { summarizeAdventureCharacters } from '@application/shared/adventureCharacterRules';

export class TurnSpeakerService implements ITurnSpeakerService {
    constructor (private readonly logger: ILogger) { }

    resolveNextSpeaker (hydrated: HydratedAdventure): ResolveTurnSpeakerReturn {
        this.logger.info('Executing TurnSpeakerService::resolveNextSpeaker');

        const summary = summarizeAdventureCharacters(hydrated.adventure);
        const progress = this.resolveTurnProgress(hydrated.adventure.chat);

        const waitingPlayerId = summary.playableCharacterIds.find(id => !progress.spokenPlayerIds.has(id));
        const isPlayersPhase = progress.spokenAiCharacterIds.size === 0;
        if (waitingPlayerId && isPlayersPhase) {
            this.logger.debug('TurnSpeakerService::resolveNextSpeaker - waiting for a player character', { characterId: waitingPlayerId });
            return { success: true };
        }

        return this.resolveAfterPlayersSpeaker(hydrated, summary.aiControlledCharacterIds, progress);
    }

    resolveSkippedPlayersSpeaker (hydrated: HydratedAdventure): ResolveTurnSpeakerReturn {
        this.logger.info('Executing TurnSpeakerService::resolveSkippedPlayersSpeaker');

        const summary = summarizeAdventureCharacters(hydrated.adventure);
        const progress = this.resolveTurnProgress(hydrated.adventure.chat);

        return this.resolveAfterPlayersSpeaker(hydrated, summary.aiControlledCharacterIds, progress);
    }

    resolveChatSpeaker (hydrated: HydratedAdventure, chat: Chat): ResolveTurnSpeakerReturn {
        this.logger.info('Executing TurnSpeakerService::resolveChatSpeaker');
        this.logger.debug('TurnSpeakerService::resolveChatSpeaker - params', { chatId: chat.id, role: chat.role });

        if (chat.role === RoleEnum.ASSISTANT) {
            return this.resolveWorldMaster(hydrated);
        }

        if (chat.role === RoleEnum.AI_PERSONA) {
            return this.resolveAiCharacter(hydrated, chat.characterId);
        }

        return { success: false, error: `Chat with id ${chat.id} cannot be generated from role ${chat.role}` };
    }

    resolveWorldMaster (hydrated: HydratedAdventure): ResolveTurnSpeakerReturn {
        this.logger.info('Executing TurnSpeakerService::resolveWorldMaster');

        const worldMaster = hydrated.worldMaster;
        if (worldMaster) {
            return {
                success: true,
                speaker: {
                    kind: TurnSpeakerKindEnum.WORLD_MASTER,
                    role: RoleEnum.ASSISTANT,
                    characterId: worldMaster.id,
                    name: worldMaster.name,
                    assistantId: worldMaster.assistantId,
                },
            };
        }

        const worldMasterCharacter = hydrated.characters.find(character => character.worldMaster === true);
        if (!worldMasterCharacter) {
            return { success: false, error: 'WorldMaster not found' };
        }

        return {
            success: true,
            speaker: {
                kind: TurnSpeakerKindEnum.WORLD_MASTER,
                role: RoleEnum.ASSISTANT,
                characterId: worldMasterCharacter.id,
                name: worldMasterCharacter.name,
                assistantId: worldMasterCharacter.assistantId,
            },
        };
    }

    private resolveAfterPlayersSpeaker (
        hydrated: HydratedAdventure,
        aiControlledCharacterIds: string[],
        progress: TurnProgress
    ): ResolveTurnSpeakerReturn {
        const nextAiCharacterId = aiControlledCharacterIds.find(id => !progress.spokenAiCharacterIds.has(id));
        if (nextAiCharacterId) {
            return this.resolveAiCharacter(hydrated, nextAiCharacterId);
        }

        return this.resolveWorldMaster(hydrated);
    }

    private resolveAiCharacter (hydrated: HydratedAdventure, characterId: string): ResolveTurnSpeakerReturn {
        const character = hydrated.characters.find(entry => entry.id === characterId);
        if (!character) {
            return { success: false, error: `AI controlled character not found: ${characterId}` };
        }

        return {
            success: true,
            speaker: {
                kind: TurnSpeakerKindEnum.AI_CHARACTER,
                role: RoleEnum.AI_PERSONA,
                characterId: character.id,
                name: character.name,
                assistantId: character.assistantId,
            },
        };
    }

    private resolveTurnProgress (chats: Chat[]): TurnProgress {
        const lastWorldMasterIndex = chats.map(chat => chat.role).lastIndexOf(RoleEnum.ASSISTANT);
        const currentTurn = chats.slice(lastWorldMasterIndex + 1);

        return {
            spokenPlayerIds: new Set(currentTurn.filter(chat => chat.role === RoleEnum.USER).map(chat => chat.characterId)),
            spokenAiCharacterIds: new Set(currentTurn.filter(chat => chat.role === RoleEnum.AI_PERSONA).map(chat => chat.characterId)),
        };
    }
}

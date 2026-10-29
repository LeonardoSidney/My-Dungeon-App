import { resolveSpeakerRuntime } from '@application/shared/resolveSpeakerRuntime';
import { RoleEnum } from '@domain/entities';
import { TurnSpeaker, TurnSpeakerKindEnum } from '@domain/services';
import { createAssistantHelper, createHydratedAdventureHelper } from '@test/helpers';

const clericSpeaker: TurnSpeaker = {
    kind: TurnSpeakerKindEnum.AI_CHARACTER,
    role: RoleEnum.AI_PERSONA,
    characterId: 'cleric',
    name: 'Cleric',
    assistantId: '1'
};

describe('resolveSpeakerRuntime', () => {
    it('resolves the runtime from the assistant of the speaker', () => {
        const runtime = resolveSpeakerRuntime(createHydratedAdventureHelper(), clericSpeaker);

        expect(runtime).toEqual({
            connectionId: '1',
            samplerId: '1',
            modelId: '1',
            characterId: 'cleric'
        });
    });

    it('resolves the model of a speaker with its own assistant', () => {
        const base = createHydratedAdventureHelper();
        const clericAssistant = createAssistantHelper({ id: 'cleric-assistant', connectionId: '1', modelId: 'cleric-model', samplerId: 'cleric-sampler' });
        const hydrated = { ...base, assistants: { ...base.assistants, [clericAssistant.id]: clericAssistant } };

        const runtime = resolveSpeakerRuntime(hydrated, { ...clericSpeaker, assistantId: 'cleric-assistant' });

        expect(runtime).toEqual({
            connectionId: '1',
            samplerId: 'cleric-sampler',
            modelId: 'cleric-model',
            characterId: 'cleric'
        });
    });

    it('returns null when the speaker assistant is not hydrated', () => {
        const hydrated = { ...createHydratedAdventureHelper(), assistants: {} };

        expect(resolveSpeakerRuntime(hydrated, clericSpeaker)).toBeNull();
    });

    it('returns null when the assistant connection is not hydrated', () => {
        const hydrated = { ...createHydratedAdventureHelper(), connections: [] };

        expect(resolveSpeakerRuntime(hydrated, clericSpeaker)).toBeNull();
    });
});

import { GetAdventureTemplatedPromptUseCase } from '@application/use-cases';
import { RoleEnum } from '@domain/entities';
import { ITextGeneration, TurnPromptPurposeEnum } from '@domain/providers';
import { IModelProviderGateway } from '@domain/gateways';
import { ITurnSpeakerService, TurnSpeaker, TurnSpeakerKindEnum } from '@domain/services';
import { IGetSystemPromptLoadOrderUseCase, IHydrateAdventureUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { createAssistantHelper, createHydratedAdventureHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockHydrateAdventureUseCase = {
    execute: jest.fn()
};

const mockTextGeneration = {
    buildAdventureTextSystemPrompt: jest.fn(),
    buildAdventureTurnMessages: jest.fn()
};

const mockGateway = {
    applyTemplate: jest.fn()
};

const mockGetSystemPromptLoadOrderUseCase = {
    execute: jest.fn()
};

const mockTurnSpeakerService = {
    resolveNextSpeaker: jest.fn(),
    resolveSkippedPlayersSpeaker: jest.fn(),
    resolveChatSpeaker: jest.fn(),
    resolveWorldMaster: jest.fn()
};

const worldMasterSpeaker: TurnSpeaker = {
    kind: TurnSpeakerKindEnum.WORLD_MASTER,
    role: RoleEnum.ASSISTANT,
    characterId: '1',
    name: 'Master',
    assistantId: '1'
};

const clericSpeaker: TurnSpeaker = {
    kind: TurnSpeakerKindEnum.AI_CHARACTER,
    role: RoleEnum.AI_PERSONA,
    characterId: 'cleric',
    name: 'Cleric',
    assistantId: '1'
};

const turnMessages = [{ role: RoleEnum.USER, content: '<turn_chat_content>\n</turn_chat_content>\n' }];

function buildUseCase (): GetAdventureTemplatedPromptUseCase {
    return new GetAdventureTemplatedPromptUseCase(
        mockLogger,
        mockTextGeneration as unknown as ITextGeneration,
        mockGateway as unknown as IModelProviderGateway,
        mockHydrateAdventureUseCase as unknown as IHydrateAdventureUseCase,
        mockGetSystemPromptLoadOrderUseCase as unknown as IGetSystemPromptLoadOrderUseCase,
        mockTurnSpeakerService as unknown as ITurnSpeakerService
    );
}

describe('GetAdventureTemplatedPromptUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGetSystemPromptLoadOrderUseCase.execute.mockResolvedValue({ success: true, loadOrder: '{systemPrompt}{characters}' });
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: true, systemPrompt: 'system prompt' });
        mockTextGeneration.buildAdventureTurnMessages.mockReturnValue({ success: true, messages: turnMessages });
        mockGateway.applyTemplate.mockResolvedValue({ success: true, prompt: 'final prompt' });
    });

    it('reuses the provided hydrated adventure without hydrating it', async () => {
        const hydrated = createHydratedAdventureHelper();

        const response = await buildUseCase().execute({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

        expect(response).toEqual({ success: true, prompt: 'final prompt' });
        expect(mockHydrateAdventureUseCase.execute).not.toHaveBeenCalled();
        expect(mockTextGeneration.buildAdventureTextSystemPrompt).toHaveBeenCalledWith(hydrated, '{systemPrompt}{characters}');
    });

    it('builds the turn messages for the requested speaker, purpose, context and target chat', async () => {
        const hydrated = createHydratedAdventureHelper();
        const request = {
            hydrated,
            speaker: clericSpeaker,
            purpose: TurnPromptPurposeEnum.REPLY,
            context: 'scene context',
            targetChatId: 'chat-2'
        };

        await buildUseCase().execute(request);

        expect(mockTextGeneration.buildAdventureTurnMessages).toHaveBeenCalledWith(request);
    });

    it('applies the template with the system prompt and the turn messages', async () => {
        await buildUseCase().execute({ hydrated: createHydratedAdventureHelper(), speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

        expect(mockGateway.applyTemplate).toHaveBeenCalledWith({
            connection: expect.objectContaining({ id: '1' }),
            modelId: '1',
            systemPrompt: 'system prompt',
            messages: turnMessages
        });
    });

    it('applies the template with the model of the speaker assistant', async () => {
        const base = createHydratedAdventureHelper();
        const clericAssistant = createAssistantHelper({ id: 'cleric-assistant', connectionId: '1', modelId: 'cleric-model' });
        const hydrated = { ...base, assistants: { ...base.assistants, [clericAssistant.id]: clericAssistant } };

        await buildUseCase().execute({
            hydrated,
            speaker: { ...clericSpeaker, assistantId: 'cleric-assistant' },
            purpose: TurnPromptPurposeEnum.REPLY
        });

        expect(mockGateway.applyTemplate).toHaveBeenCalledWith(expect.objectContaining({ modelId: 'cleric-model' }));
    });

    it('fails with the load order error without building the system prompt', async () => {
        mockGetSystemPromptLoadOrderUseCase.execute.mockResolvedValue({ success: false, error: 'Failed to load settings' });

        const response = await buildUseCase().execute({ hydrated: createHydratedAdventureHelper(), speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

        expect(response).toEqual({ success: false, error: 'Failed to load settings' });
        expect(mockTextGeneration.buildAdventureTextSystemPrompt).not.toHaveBeenCalled();
    });

    it('fails with a generic error when the load order is missing', async () => {
        mockGetSystemPromptLoadOrderUseCase.execute.mockResolvedValue({ success: true });

        const response = await buildUseCase().execute({ hydrated: createHydratedAdventureHelper(), speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

        expect(response).toEqual({ success: false, error: 'Failed to load system prompt load order' });
    });

    it('fails without applying the template when the system prompt fails', async () => {
        mockTextGeneration.buildAdventureTextSystemPrompt.mockReturnValue({ success: false, error: 'Template failure' });

        const response = await buildUseCase().execute({ hydrated: createHydratedAdventureHelper(), speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

        expect(response).toEqual({ success: false, error: 'Template failure' });
        expect(mockGateway.applyTemplate).not.toHaveBeenCalled();
    });

    it('fails without applying the template when the turn messages fail', async () => {
        mockTextGeneration.buildAdventureTurnMessages.mockReturnValue({ success: false, error: 'Chat with id missing was not found' });

        const response = await buildUseCase().execute({ hydrated: createHydratedAdventureHelper(), speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

        expect(response).toEqual({ success: false, error: 'Chat with id missing was not found' });
        expect(mockGateway.applyTemplate).not.toHaveBeenCalled();
    });

    it('fails with a generic error when the turn messages are missing', async () => {
        mockTextGeneration.buildAdventureTurnMessages.mockReturnValue({ success: true });

        const response = await buildUseCase().execute({ hydrated: createHydratedAdventureHelper(), speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

        expect(response).toEqual({ success: false, error: 'Failed to build turn messages' });
    });

    it('fails with the gateway error', async () => {
        mockGateway.applyTemplate.mockResolvedValue({ success: false, error: 'applyTemplate failed with status 500' });

        const response = await buildUseCase().execute({ hydrated: createHydratedAdventureHelper(), speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

        expect(response).toEqual({ success: false, error: 'applyTemplate failed with status 500' });
    });

    it('fails with a generic error when the gateway returns an empty prompt', async () => {
        mockGateway.applyTemplate.mockResolvedValue({ success: true, prompt: '' });

        const response = await buildUseCase().execute({ hydrated: createHydratedAdventureHelper(), speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

        expect(response).toEqual({ success: false, error: 'Model did not return a prompt' });
    });

    it('fails when the speaker assistant is not hydrated', async () => {
        const hydrated = { ...createHydratedAdventureHelper(), assistants: {} };

        const response = await buildUseCase().execute({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

        expect(response).toEqual({ success: false, error: 'Assistant not found: 1' });
        expect(mockGateway.applyTemplate).not.toHaveBeenCalled();
    });

    it('fails when the speaker assistant connection is not hydrated', async () => {
        const hydrated = { ...createHydratedAdventureHelper(), connections: [] };

        const response = await buildUseCase().execute({ hydrated, speaker: clericSpeaker, purpose: TurnPromptPurposeEnum.REPLY });

        expect(response).toEqual({ success: false, error: 'Connection not found: 1' });
    });

    it('fails when the speaker assistant has no model', async () => {
        const response = await buildUseCase().execute({
            hydrated: createHydratedAdventureHelper({ modelId: '' }),
            speaker: clericSpeaker,
            purpose: TurnPromptPurposeEnum.REPLY
        });

        expect(response.success).toBe(false);
        expect(mockGateway.applyTemplate).not.toHaveBeenCalled();
    });

    describe('when hydrating the adventure by id', () => {
        it('builds the reply prompt of the next speaker', async () => {
            const hydrated = createHydratedAdventureHelper();
            mockHydrateAdventureUseCase.execute.mockResolvedValue({ success: true, hydrated });
            mockTurnSpeakerService.resolveNextSpeaker.mockReturnValue({ success: true, speaker: clericSpeaker });

            const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

            expect(response).toEqual({ success: true, prompt: 'final prompt' });
            expect(mockHydrateAdventureUseCase.execute).toHaveBeenCalledWith({ adventureId: 'adventure-1' });
            expect(mockTextGeneration.buildAdventureTurnMessages).toHaveBeenCalledWith({
                hydrated,
                speaker: clericSpeaker,
                purpose: TurnPromptPurposeEnum.REPLY
            });
        });

        it('builds the world master prompt while the turn waits for the players', async () => {
            const hydrated = createHydratedAdventureHelper();
            mockHydrateAdventureUseCase.execute.mockResolvedValue({ success: true, hydrated });
            mockTurnSpeakerService.resolveNextSpeaker.mockReturnValue({ success: true });
            mockTurnSpeakerService.resolveWorldMaster.mockReturnValue({ success: true, speaker: worldMasterSpeaker });

            await buildUseCase().execute({ adventureId: 'adventure-1' });

            expect(mockTextGeneration.buildAdventureTurnMessages).toHaveBeenCalledWith(expect.objectContaining({ speaker: worldMasterSpeaker }));
        });

        it('returns the next speaker error without building the prompt', async () => {
            mockHydrateAdventureUseCase.execute.mockResolvedValue({ success: true, hydrated: createHydratedAdventureHelper() });
            mockTurnSpeakerService.resolveNextSpeaker.mockReturnValue({ success: false, error: 'AI controlled character not found: cleric' });

            const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

            expect(response).toEqual({ success: false, error: 'AI controlled character not found: cleric' });
            expect(mockTextGeneration.buildAdventureTextSystemPrompt).not.toHaveBeenCalled();
        });

        it('returns the world master error when the turn waits for the players and there is no world master', async () => {
            mockHydrateAdventureUseCase.execute.mockResolvedValue({ success: true, hydrated: createHydratedAdventureHelper() });
            mockTurnSpeakerService.resolveNextSpeaker.mockReturnValue({ success: true });
            mockTurnSpeakerService.resolveWorldMaster.mockReturnValue({ success: false, error: 'WorldMaster not found' });

            const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

            expect(response).toEqual({ success: false, error: 'WorldMaster not found' });
        });

        it('returns the hydration error without building the prompt', async () => {
            mockHydrateAdventureUseCase.execute.mockResolvedValue({ success: false, error: 'Some characters were not found' });

            const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

            expect(response).toEqual({ success: false, error: 'Some characters were not found' });
            expect(mockTextGeneration.buildAdventureTextSystemPrompt).not.toHaveBeenCalled();
            expect(mockGateway.applyTemplate).not.toHaveBeenCalled();
        });

        it('fails with a generic error when hydration returns no adventure', async () => {
            mockHydrateAdventureUseCase.execute.mockResolvedValue({ success: true });

            const response = await buildUseCase().execute({ adventureId: 'adventure-1' });

            expect(response).toEqual({ success: false, error: 'Failed to hydrate adventure' });
        });
    });
});

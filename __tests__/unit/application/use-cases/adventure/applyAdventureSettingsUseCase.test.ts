import { ApplyAdventureSettingsUseCase } from '@application/use-cases';
import { ILogger } from '@domain/logger';
import {
    createAdventureRequestHelper,
    createAssistantHelper,
    createCharacterHelper,
    createSamplerHelper,
    createWorldMasterHelper,
} from '@test/helpers';

const logger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

const succeeded = () => ({ execute: jest.fn().mockResolvedValue({ success: true }) });

function buildUseCase () {
    const mocks = {
        editAdventure: succeeded(),
        getCharacter: { execute: jest.fn(async ({ id }: { id: string; }) => ({ success: true, character: createCharacterHelper({ id, name: 'Bram', assistantId: 'as-1' }) })) },
        editCharacter: succeeded(),
        getWorldMaster: { execute: jest.fn(async ({ id }: { id: string; }) => ({ success: true, worldMaster: createWorldMasterHelper({ id, name: 'Luna', assistantId: 'as-1' }) })) },
        editWorldMaster: succeeded(),
        getAssistant: { execute: jest.fn(async ({ id }: { id: string; }) => ({ success: true, assistant: createAssistantHelper({ id, name: 'Qwen', samplerId: 's-1' }) })) },
        editAssistant: succeeded(),
        getSampler: { execute: jest.fn(async ({ id }: { id: string; }) => ({ success: true, sampler: createSamplerHelper({ id, name: 'Balanced', temperature: 0.8, topK: 40 }) })) },
        editSampler: succeeded(),
    };
    const useCase = new ApplyAdventureSettingsUseCase(
        logger,
        mocks.editAdventure,
        mocks.getCharacter,
        mocks.editCharacter,
        mocks.getWorldMaster,
        mocks.editWorldMaster,
        mocks.getAssistant,
        mocks.editAssistant,
        mocks.getSampler,
        mocks.editSampler
    );
    return { useCase, mocks };
}

const NO_GENERATION_EDITS = {
    characterAssistants: {},
    worldMasterAssistants: {},
    assistantSamplers: {},
    samplerParameters: {},
};

const ADVENTURE = createAdventureRequestHelper();

describe('ApplyAdventureSettingsUseCase', () => {
    it('saves the adventure through the edit adventure use case', async () => {
        const { useCase, mocks } = buildUseCase();

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS });

        expect(response).toEqual({ success: true });
        expect(mocks.editAdventure.execute).toHaveBeenCalledWith({ id: 'adv-1', editParams: ADVENTURE });
        expect(mocks.editCharacter.execute).not.toHaveBeenCalled();
    });

    it('saves every generation edit to its own entity, keeping the other fields', async () => {
        const { useCase, mocks } = buildUseCase();

        await useCase.execute({
            adventureId: 'adv-1',
            adventure: ADVENTURE,
            characterAssistants: { bram: 'as-2' },
            worldMasterAssistants: { luna: 'as-3' },
            assistantSamplers: { 'as-2': 's-2' },
            samplerParameters: { 's-2': { temperature: 1.2, topK: undefined } },
        });

        expect(mocks.editCharacter.execute).toHaveBeenCalledWith({
            id: 'bram',
            editParams: expect.objectContaining({ name: 'Bram', assistantId: 'as-2' }),
        });
        expect(mocks.editWorldMaster.execute).toHaveBeenCalledWith({
            id: 'luna',
            editParams: expect.objectContaining({ name: 'Luna', assistantId: 'as-3' }),
        });
        expect(mocks.editAssistant.execute).toHaveBeenCalledWith({
            id: 'as-2',
            editParams: expect.objectContaining({ name: 'Qwen', samplerId: 's-2' }),
        });
        const samplerEdit = mocks.editSampler.execute.mock.calls[0][0];
        expect(samplerEdit.id).toBe('s-2');
        expect(samplerEdit.editParams).toEqual(expect.objectContaining({ name: 'Balanced', temperature: 1.2 }));
        expect(samplerEdit.editParams.topK).toBeUndefined();
    });

    it('stops before touching any entity when the adventure cannot be saved', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.editAdventure.execute.mockResolvedValue({ success: false, error: 'A system prompt is required' });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, characterAssistants: { bram: 'as-2' } });

        expect(response).toEqual({ success: false, error: 'A system prompt is required' });
        expect(mocks.getCharacter.execute).not.toHaveBeenCalled();
    });

    it('stops at the first failing step and returns its error', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.editCharacter.execute.mockResolvedValue({ success: false, error: 'Assistant not found: as-9' });

        const response = await useCase.execute({
            adventureId: 'adv-1',
            adventure: ADVENTURE,
            ...NO_GENERATION_EDITS,
            characterAssistants: { bram: 'as-9' },
            assistantSamplers: { 'as-1': 's-2' },
        });

        expect(response).toEqual({ success: false, error: 'Assistant not found: as-9' });
        expect(mocks.editAssistant.execute).not.toHaveBeenCalled();
    });

    it('uses a default message when the adventure fails without one', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.editAdventure.execute.mockResolvedValue({ success: false });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS });

        expect(response).toEqual({ success: false, error: 'Failed to save the adventure' });
    });

    it.each([
        ['character', 'getCharacter', { characterAssistants: { bram: 'as-2' } }, 'Character not found: bram'],
        ['world master', 'getWorldMaster', { worldMasterAssistants: { luna: 'as-2' } }, 'World master not found: luna'],
        ['assistant', 'getAssistant', { assistantSamplers: { 'as-1': 's-2' } }, 'Assistant not found: as-1'],
        ['sampler', 'getSampler', { samplerParameters: { 's-1': { topK: 5 } } }, 'Sampler not found: s-1'],
    ] as const)('stops when the %s does not exist', async (_, getter, edits, error) => {
        const { useCase, mocks } = buildUseCase();
        mocks[getter].execute.mockResolvedValue({ success: true } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error });
    });

    it.each([
        ['character', 'getCharacter', { characterAssistants: { bram: 'as-2' } }],
        ['world master', 'getWorldMaster', { worldMasterAssistants: { luna: 'as-2' } }],
        ['assistant', 'getAssistant', { assistantSamplers: { 'as-1': 's-2' } }],
        ['sampler', 'getSampler', { samplerParameters: { 's-1': { topK: 5 } } }],
    ] as const)('returns the load error of the %s', async (_, getter, edits) => {
        const { useCase, mocks } = buildUseCase();
        mocks[getter].execute.mockResolvedValue({ success: false, error: 'Storage unavailable' } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Storage unavailable' });
    });

    it.each([
        ['editCharacter', { characterAssistants: { bram: 'as-2' } }, 'Failed to update the assistant of Bram'],
        ['editWorldMaster', { worldMasterAssistants: { luna: 'as-2' } }, 'Failed to update the assistant of Luna'],
        ['editAssistant', { assistantSamplers: { 'as-1': 's-2' } }, 'Failed to update the sampler of Qwen'],
        ['editSampler', { samplerParameters: { 's-1': { topK: 5 } } }, 'Failed to update the sampler Balanced'],
    ] as const)('uses a default message when %s fails without one', async (editor, edits, error) => {
        const { useCase, mocks } = buildUseCase();
        mocks[editor].execute.mockResolvedValue({ success: false });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error });
    });

    it('refuses to edit a system sampler', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.getSampler.execute.mockResolvedValue({ success: true, sampler: createSamplerHelper({ id: 's-0', name: 'top_k', systemDefault: true }) });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, samplerParameters: { 's-0': { topK: 5 } } });

        expect(response).toEqual({ success: false, error: 'top_k is a system sampler and cannot be edited' });
        expect(mocks.editSampler.execute).not.toHaveBeenCalled();
    });

    it('fails without saving anything when the adventure id is blank', async () => {
        const { useCase, mocks } = buildUseCase();

        const response = await useCase.execute({ adventureId: ' ', adventure: ADVENTURE, ...NO_GENERATION_EDITS });

        expect(response).toEqual({ success: false, error: 'Adventure id is required' });
        expect(mocks.editAdventure.execute).not.toHaveBeenCalled();
    });
});

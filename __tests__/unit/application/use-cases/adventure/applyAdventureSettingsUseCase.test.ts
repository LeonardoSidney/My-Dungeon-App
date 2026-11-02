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
    storage: jest.fn(),
    streaming: jest.fn(),
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

    it('does not edit any entity when the adventure cannot be saved', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.editAdventure.execute.mockResolvedValue({ success: false, error: 'A system prompt is required' });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, characterAssistants: { bram: 'as-2' } });

        expect(response).toEqual({ success: false, error: 'A system prompt is required' });
        expect(mocks.editCharacter.execute).not.toHaveBeenCalled();
    });

    it('stops at the first failing step and returns its error', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.editCharacter.execute.mockResolvedValue({ success: false, error: 'Entity not found for id: as-9 from Assistants' });

        const response = await useCase.execute({
            adventureId: 'adv-1',
            adventure: ADVENTURE,
            ...NO_GENERATION_EDITS,
            characterAssistants: { bram: 'as-9' },
            assistantSamplers: { 'as-1': 's-2' },
        });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: as-9 from Assistants' });
        expect(mocks.editAssistant.execute).not.toHaveBeenCalled();
    });

    it('uses a default message when the adventure fails without one', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.editAdventure.execute.mockResolvedValue({ success: false });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS });

        expect(response).toEqual({ success: false, error: 'Failed to save the adventure' });
    });

    it('stops when the character does not exist', async () => {
        const edits = { characterAssistants: { bram: 'as-2' } };

        const { useCase, mocks } = buildUseCase();
        mocks.getCharacter.execute.mockResolvedValue({ success: true } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: bram from Characters' });
    });

    it('stops when the world master does not exist', async () => {
        const edits = { worldMasterAssistants: { luna: 'as-2' } };

        const { useCase, mocks } = buildUseCase();
        mocks.getWorldMaster.execute.mockResolvedValue({ success: true } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: luna from World Masters' });
    });

    it('stops when the assistant does not exist', async () => {
        const edits = { assistantSamplers: { 'as-1': 's-2' } };

        const { useCase, mocks } = buildUseCase();
        mocks.getAssistant.execute.mockResolvedValue({ success: true } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: as-1 from Assistants' });
    });

    it('stops when the sampler does not exist', async () => {
        const edits = { samplerParameters: { 's-1': { topK: 5 } } };

        const { useCase, mocks } = buildUseCase();
        mocks.getSampler.execute.mockResolvedValue({ success: true } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: s-1 from Samplers' });
    });

    it('returns the load error of the character', async () => {
        const edits = { characterAssistants: { bram: 'as-2' } };

        const { useCase, mocks } = buildUseCase();
        mocks.getCharacter.execute.mockResolvedValue({ success: false, error: 'Storage unavailable' } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Storage unavailable' });
    });

    it('returns the load error of the world master', async () => {
        const edits = { worldMasterAssistants: { luna: 'as-2' } };

        const { useCase, mocks } = buildUseCase();
        mocks.getWorldMaster.execute.mockResolvedValue({ success: false, error: 'Storage unavailable' } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Storage unavailable' });
    });

    it('returns the load error of the assistant', async () => {
        const edits = { assistantSamplers: { 'as-1': 's-2' } };

        const { useCase, mocks } = buildUseCase();
        mocks.getAssistant.execute.mockResolvedValue({ success: false, error: 'Storage unavailable' } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Storage unavailable' });
    });

    it('returns the load error of the sampler', async () => {
        const edits = { samplerParameters: { 's-1': { topK: 5 } } };

        const { useCase, mocks } = buildUseCase();
        mocks.getSampler.execute.mockResolvedValue({ success: false, error: 'Storage unavailable' } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Storage unavailable' });
    });

    it('uses a default message when editCharacter fails without one', async () => {
        const edits = { characterAssistants: { bram: 'as-2' } };

        const { useCase, mocks } = buildUseCase();
        mocks.editCharacter.execute.mockResolvedValue({ success: false });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Failed to update the assistant of Bram' });
    });

    it('uses a default message when editWorldMaster fails without one', async () => {
        const edits = { worldMasterAssistants: { luna: 'as-2' } };

        const { useCase, mocks } = buildUseCase();
        mocks.editWorldMaster.execute.mockResolvedValue({ success: false });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Failed to update the assistant of Luna' });
    });

    it('uses a default message when editAssistant fails without one', async () => {
        const edits = { assistantSamplers: { 'as-1': 's-2' } };

        const { useCase, mocks } = buildUseCase();
        mocks.editAssistant.execute.mockResolvedValue({ success: false });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Failed to update the sampler of Qwen' });
    });

    it('uses a default message when editSampler fails without one', async () => {
        const edits = { samplerParameters: { 's-1': { topK: 5 } } };

        const { useCase, mocks } = buildUseCase();
        mocks.editSampler.execute.mockResolvedValue({ success: false });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, ...edits });

        expect(response).toEqual({ success: false, error: 'Failed to update the sampler Balanced' });
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

    it('checks every entity before saving the adventure', async () => {
        const { useCase, mocks } = buildUseCase();

        await useCase.execute({
            adventureId: 'adv-1',
            adventure: ADVENTURE,
            characterAssistants: { bram: 'as-2' },
            worldMasterAssistants: { luna: 'as-3' },
            assistantSamplers: { 'as-4': 's-2' },
            samplerParameters: { 's-3': { topK: 5 } },
        });

        const adventureOrder = mocks.editAdventure.execute.mock.invocationCallOrder[0];
        const loadOrders = [
            ...mocks.getCharacter.execute.mock.invocationCallOrder,
            ...mocks.getWorldMaster.execute.mock.invocationCallOrder,
            ...mocks.getAssistant.execute.mock.invocationCallOrder,
            ...mocks.getSampler.execute.mock.invocationCallOrder,
        ];
        expect(loadOrders.every(order => order < adventureOrder)).toBe(true);
        expect(mocks.getCharacter.execute).toHaveBeenCalledWith({ id: 'bram' });
        expect(mocks.getWorldMaster.execute).toHaveBeenCalledWith({ id: 'luna' });
    });

    it('checks the assistants that are being edited and the ones being assigned', async () => {
        const { useCase, mocks } = buildUseCase();

        await useCase.execute({
            adventureId: 'adv-1',
            adventure: ADVENTURE,
            ...NO_GENERATION_EDITS,
            characterAssistants: { bram: 'as-2' },
            worldMasterAssistants: { luna: 'as-3' },
            assistantSamplers: { 'as-4': 's-2' },
        });

        const checkedIds = mocks.getAssistant.execute.mock.calls.map(([params]) => params.id);
        expect(checkedIds).toEqual(['as-4', 'as-2', 'as-3']);
    });

    it('checks the samplers that are being edited and the ones being assigned', async () => {
        const { useCase, mocks } = buildUseCase();

        await useCase.execute({
            adventureId: 'adv-1',
            adventure: ADVENTURE,
            ...NO_GENERATION_EDITS,
            assistantSamplers: { 'as-1': 's-2' },
            samplerParameters: { 's-3': { topK: 5 } },
        });

        const checkedIds = mocks.getSampler.execute.mock.calls.map(([params]) => params.id);
        expect(checkedIds).toEqual(['s-3', 's-2']);
    });

    it('checks an id used twice only once', async () => {
        const { useCase, mocks } = buildUseCase();

        await useCase.execute({
            adventureId: 'adv-1',
            adventure: ADVENTURE,
            ...NO_GENERATION_EDITS,
            characterAssistants: { bram: 'as-2', ana: 'as-2' },
        });

        expect(mocks.getAssistant.execute).toHaveBeenCalledTimes(1);
    });

    it('reuses the loaded entities instead of loading them again', async () => {
        const { useCase, mocks } = buildUseCase();

        await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, characterAssistants: { bram: 'as-2' } });

        expect(mocks.getCharacter.execute).toHaveBeenCalledTimes(1);
    });

    it('saves nothing when a character does not exist', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.getCharacter.execute.mockResolvedValue({ success: true } as never);

        await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, characterAssistants: { bram: 'as-2' } });

        expect(mocks.editAdventure.execute).not.toHaveBeenCalled();
    });

    it('saves nothing when a world master does not exist', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.getWorldMaster.execute.mockResolvedValue({ success: true } as never);

        await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, worldMasterAssistants: { luna: 'as-2' } });

        expect(mocks.editAdventure.execute).not.toHaveBeenCalled();
    });

    it('saves nothing when the assistant assigned to a character does not exist', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.getAssistant.execute.mockResolvedValue({ success: true } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, characterAssistants: { bram: 'as-9' } });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: as-9 from Assistants' });
        expect(mocks.editAdventure.execute).not.toHaveBeenCalled();
    });

    it('saves nothing when the assistant assigned to a world master does not exist', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.getAssistant.execute.mockResolvedValue({ success: true } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, worldMasterAssistants: { luna: 'as-9' } });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: as-9 from Assistants' });
        expect(mocks.editAdventure.execute).not.toHaveBeenCalled();
    });

    it('saves nothing when the sampler assigned to an assistant does not exist', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.getSampler.execute.mockResolvedValue({ success: true } as never);

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, assistantSamplers: { 'as-1': 's-9' } });

        expect(response).toEqual({ success: false, error: 'Entity not found for id: s-9 from Samplers' });
        expect(mocks.editAdventure.execute).not.toHaveBeenCalled();
    });

    it('saves nothing when the sampler to edit is a system sampler', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.getSampler.execute.mockResolvedValue({ success: true, sampler: createSamplerHelper({ id: 's-0', name: 'top_k', systemDefault: true }) });

        await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, samplerParameters: { 's-0': { topK: 5 } } });

        expect(mocks.editAdventure.execute).not.toHaveBeenCalled();
    });

    it('accepts a system sampler as the sampler assigned to an assistant', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.getSampler.execute.mockResolvedValue({ success: true, sampler: createSamplerHelper({ id: 's-0', systemDefault: true }) });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, assistantSamplers: { 'as-1': 's-0' } });

        expect(response).toEqual({ success: true });
    });

    it('saves nothing when the new adaptive value is out of range', async () => {
        const { useCase, mocks } = buildUseCase();

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, samplerParameters: { 's-1': { adaptiveTarget: 5 } } });

        expect(response).toEqual({ success: false, error: 'Adaptive target must be greater than 0 and up to 1 to edit a sampler' });
        expect(mocks.editAdventure.execute).not.toHaveBeenCalled();
    });

    it('saves nothing when the stored adaptive value is out of range', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.getSampler.execute.mockResolvedValue({ success: true, sampler: createSamplerHelper({ id: 's-1', adaptiveDecay: 1.1 }) });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, samplerParameters: { 's-1': { topK: 5 } } });

        expect(response).toEqual({ success: false, error: 'Adaptive decay must be greater than 0 and up to 0.99 to edit a sampler' });
        expect(mocks.editAdventure.execute).not.toHaveBeenCalled();
    });

    it('fixes a stored adaptive value that the new parameters bring back into range', async () => {
        const { useCase, mocks } = buildUseCase();
        mocks.getSampler.execute.mockResolvedValue({ success: true, sampler: createSamplerHelper({ id: 's-1', adaptiveDecay: 1.1 }) });

        const response = await useCase.execute({ adventureId: 'adv-1', adventure: ADVENTURE, ...NO_GENERATION_EDITS, samplerParameters: { 's-1': { adaptiveDecay: 0.9 } } });

        expect(response).toEqual({ success: true });
    });
});

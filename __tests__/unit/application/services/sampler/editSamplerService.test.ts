import { EditSamplerService } from '@application/services/sampler';
import { MirostatEnum, Sampler } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { SamplerEditParams } from '@domain/services';
import { createSamplerHelper } from '@test/helpers';

const CREATED_AT = '2026-01-10T08:00:00.000Z';
const PREVIOUS_UPDATED_AT = '2026-02-20T09:30:00.000Z';
const NOW = '2026-06-15T12:00:00.000Z';

const mockLogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

function createStoredSampler (overrides?: Partial<Sampler>): Sampler {
    return createSamplerHelper({
        id: 'sampler-1',
        name: 'Balanced',
        observation: 'Good for chat',
        adaptiveDecay: 0.9,
        adaptiveTarget: 0.5,
        dryAllowedLength: 2,
        dryBase: 1.75,
        dryMultiplier: 0.1,
        drySequenceBreakers: 'stored',
        dynaTempExp: 1,
        dynaTempRange: 0.5,
        ignoreEOS: true,
        minP: 0.05,
        mirostat: MirostatEnum.MIROSTAT1,
        mirostatEnt: 5,
        mirostatLr: 0.1,
        frequencyPenalty: 0.1,
        presencePenalty: 0.2,
        repeatLastN: 64,
        repeatPenalty: 1.1,
        seed: '111',
        temperature: 0.8,
        topK: 40,
        topNSigma: 1.5,
        topP: 0.95,
        typicalP: 0.9,
        xtcProbability: 0.3,
        xtcThreshold: 0.2,
        systemDefault: false,
        createdAt: new Date(CREATED_AT),
        updatedAt: new Date(PREVIOUS_UPDATED_AT),
        ...overrides
    });
}

function createEditParams (overrides?: Partial<SamplerEditParams>): SamplerEditParams {
    return {
        name: 'Balanced',
        observation: 'Good for chat',
        adaptiveDecay: 0.9,
        adaptiveTarget: 0.5,
        dryAllowedLength: 2,
        dryBase: 1.75,
        dryMultiplier: 0.1,
        drySequenceBreakers: 'stored',
        dynaTempExp: 1,
        dynaTempRange: 0.5,
        ignoreEOS: true,
        minP: 0.05,
        mirostat: MirostatEnum.MIROSTAT1,
        mirostatEnt: 5,
        mirostatLr: 0.1,
        frequencyPenalty: 0.1,
        presencePenalty: 0.2,
        repeatLastN: 64,
        repeatPenalty: 1.1,
        seed: '111',
        temperature: 0.8,
        topK: 40,
        topNSigma: 1.5,
        topP: 0.95,
        typicalP: 0.9,
        xtcProbability: 0.3,
        xtcThreshold: 0.2,
        ...overrides
    };
}

describe('EditSamplerService', () => {
    let service: EditSamplerService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        service = new EditSamplerService(mockLogger as unknown as ILogger);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.editSampler({ sampler: createStoredSampler(), editParams: createEditParams() });

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing EditSamplerService::editSampler');
    });

    it('should not log a warning or an error on a successful edit', () => {
        service.editSampler({ sampler: createStoredSampler(), editParams: createEditParams() });

        expect(mockLogger.warning).not.toHaveBeenCalled();
        expect(mockLogger.error).not.toHaveBeenCalled();
    });

    it('should log the edited sampler for debugging', () => {
        const response = service.editSampler({ sampler: createStoredSampler(), editParams: createEditParams() });

        expect(mockLogger.debug).toHaveBeenCalledWith('Sampler edited with success', response.sampler);
    });

    it('should return only success and the edited sampler with every entity field', () => {
        const editParams: Required<SamplerEditParams> = {
            name: 'Creative',
            observation: 'Good for stories',
            adaptiveDecay: 0.8,
            adaptiveTarget: 0.6,
            dryAllowedLength: 3,
            dryBase: 1.5,
            dryMultiplier: 0.2,
            drySequenceBreakers: 'edited',
            dynaTempExp: 2,
            dynaTempRange: 1,
            ignoreEOS: false,
            minP: 0.1,
            mirostat: MirostatEnum.MIROSTAT2,
            mirostatEnt: 6,
            mirostatLr: 0.2,
            frequencyPenalty: 0.3,
            presencePenalty: 0.4,
            repeatLastN: 128,
            repeatPenalty: 1.2,
            seed: '222',
            temperature: 1.2,
            topK: 80,
            topNSigma: 2,
            topP: 0.9,
            typicalP: 0.8,
            xtcProbability: 0.4,
            xtcThreshold: 0.1
        };

        const response = service.editSampler({ sampler: createStoredSampler(), editParams });

        expect(response).toStrictEqual({
            success: true,
            sampler: {
                ...editParams,
                id: 'sampler-1',
                systemDefault: false,
                createdAt: new Date(CREATED_AT),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should keep the id of the sampler', () => {
        const response = service.editSampler({
            sampler: createStoredSampler({ id: 'sampler-42' }),
            editParams: createEditParams()
        });

        expect(response.sampler?.id).toBe('sampler-42');
    });

    it('should keep the createdAt of the sampler', () => {
        const response = service.editSampler({
            sampler: createStoredSampler(),
            editParams: createEditParams()
        });

        expect(response.sampler?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an id that reaches the service inside editParams', () => {
        const editParamsWithId = { ...createEditParams(), id: 'another-sampler' };

        const response = service.editSampler({
            sampler: createStoredSampler({ id: 'sampler-42' }),
            editParams: editParamsWithId
        });

        expect(response.sampler?.id).toBe('sampler-42');
    });

    it('should ignore a createdAt that reaches the service inside editParams', () => {
        const editParamsWithCreatedAt = { ...createEditParams(), createdAt: new Date(NOW) };

        const response = service.editSampler({
            sampler: createStoredSampler(),
            editParams: editParamsWithCreatedAt
        });

        expect(response.sampler?.createdAt).toEqual(new Date(CREATED_AT));
    });

    it('should ignore an updatedAt that reaches the service inside editParams', () => {
        const editParamsWithUpdatedAt = { ...createEditParams(), updatedAt: new Date(PREVIOUS_UPDATED_AT) };

        const response = service.editSampler({
            sampler: createStoredSampler(),
            editParams: editParamsWithUpdatedAt
        });

        expect(response.sampler?.updatedAt).toEqual(new Date(NOW));
    });

    it('should ignore fields that are not editable sampler fields', () => {
        const editParamsWithUnknownField = { ...createEditParams(), unknownField: 'unexpected' };

        const response = service.editSampler({
            sampler: createStoredSampler(),
            editParams: editParamsWithUnknownField
        });

        expect(response.sampler).not.toHaveProperty('unknownField');
    });

    it('should ignore a systemDefault that reaches the service inside editParams', () => {
        const editParamsWithSystemDefault = { ...createEditParams(), systemDefault: true };

        const response = service.editSampler({
            sampler: createStoredSampler(),
            editParams: editParamsWithSystemDefault
        });

        expect(response.sampler?.systemDefault).toBe(false);
    });

    it('should keep the systemDefault of the sampler', () => {
        const response = service.editSampler({
            sampler: createStoredSampler({ systemDefault: true }),
            editParams: createEditParams()
        });

        expect(response.sampler?.systemDefault).toBe(true);
    });

    it('should clear every optional field when they are sent as undefined', () => {
        const response = service.editSampler({
            sampler: createStoredSampler(),
            editParams: {
                name: 'Balanced',
                observation: undefined,
                adaptiveDecay: undefined,
                adaptiveTarget: undefined,
                dryAllowedLength: undefined,
                dryBase: undefined,
                dryMultiplier: undefined,
                drySequenceBreakers: undefined,
                dynaTempExp: undefined,
                dynaTempRange: undefined,
                ignoreEOS: undefined,
                minP: undefined,
                mirostat: undefined,
                mirostatEnt: undefined,
                mirostatLr: undefined,
                frequencyPenalty: undefined,
                presencePenalty: undefined,
                repeatLastN: undefined,
                repeatPenalty: undefined,
                seed: undefined,
                temperature: undefined,
                topK: undefined,
                topNSigma: undefined,
                topP: undefined,
                typicalP: undefined,
                xtcProbability: undefined,
                xtcThreshold: undefined,
            }
        });

        expect(response.sampler).toStrictEqual({
            id: 'sampler-1',
            name: 'Balanced',
            systemDefault: false,
            observation: undefined,
            adaptiveDecay: undefined,
            adaptiveTarget: undefined,
            dryAllowedLength: undefined,
            dryBase: undefined,
            dryMultiplier: undefined,
            drySequenceBreakers: undefined,
            dynaTempExp: undefined,
            dynaTempRange: undefined,
            ignoreEOS: undefined,
            minP: undefined,
            mirostat: undefined,
            mirostatEnt: undefined,
            mirostatLr: undefined,
            frequencyPenalty: undefined,
            presencePenalty: undefined,
            repeatLastN: undefined,
            repeatPenalty: undefined,
            seed: undefined,
            temperature: undefined,
            topK: undefined,
            topNSigma: undefined,
            topP: undefined,
            typicalP: undefined,
            xtcProbability: undefined,
            xtcThreshold: undefined,
            createdAt: new Date(CREATED_AT),
            updatedAt: new Date(NOW)
        });
    });

    it('should clear every optional field when the keys are omitted', () => {
        const response = service.editSampler({
            sampler: createStoredSampler(),
            editParams: { name: 'Balanced' }
        });

        expect(response.sampler).toStrictEqual({
            id: 'sampler-1',
            name: 'Balanced',
            systemDefault: false,
            observation: undefined,
            adaptiveDecay: undefined,
            adaptiveTarget: undefined,
            dryAllowedLength: undefined,
            dryBase: undefined,
            dryMultiplier: undefined,
            drySequenceBreakers: undefined,
            dynaTempExp: undefined,
            dynaTempRange: undefined,
            ignoreEOS: undefined,
            minP: undefined,
            mirostat: undefined,
            mirostatEnt: undefined,
            mirostatLr: undefined,
            frequencyPenalty: undefined,
            presencePenalty: undefined,
            repeatLastN: undefined,
            repeatPenalty: undefined,
            seed: undefined,
            temperature: undefined,
            topK: undefined,
            topNSigma: undefined,
            topP: undefined,
            typicalP: undefined,
            xtcProbability: undefined,
            xtcThreshold: undefined,
            createdAt: new Date(CREATED_AT),
            updatedAt: new Date(NOW)
        });
    });

    it('should store zero, false and empty values instead of dropping them', () => {
        const editParams: Required<SamplerEditParams> = {
            name: 'Balanced',
            observation: '',
            adaptiveDecay: 0,
            adaptiveTarget: 0,
            dryAllowedLength: 0,
            dryBase: 0,
            dryMultiplier: 0,
            drySequenceBreakers: '',
            dynaTempExp: 0,
            dynaTempRange: 0,
            ignoreEOS: false,
            minP: 0,
            mirostat: MirostatEnum.DEFAULT,
            mirostatEnt: 0,
            mirostatLr: 0,
            frequencyPenalty: 0,
            presencePenalty: 0,
            repeatLastN: 0,
            repeatPenalty: 0,
            seed: '',
            temperature: 0,
            topK: 0,
            topNSigma: 0,
            topP: 0,
            typicalP: 0,
            xtcProbability: 0,
            xtcThreshold: 0
        };

        const response = service.editSampler({ sampler: createStoredSampler(), editParams });

        expect(response.sampler).toStrictEqual({
            ...editParams,
            id: 'sampler-1',
            systemDefault: false,
            createdAt: new Date(CREATED_AT),
            updatedAt: new Date(NOW)
        });
    });

    it('should refresh updatedAt even when no field changes', () => {
        const response = service.editSampler({
            sampler: createStoredSampler(),
            editParams: createEditParams()
        });

        expect(response.sampler?.updatedAt).toEqual(new Date(NOW));
    });

    it('should keep the stored data when the whole sampler is sent with a new temperature', () => {
        const sampler = createStoredSampler();

        const response = service.editSampler({
            sampler: sampler,
            editParams: { ...sampler, temperature: 1.2 }
        });

        expect(response.sampler).toEqual(createStoredSampler({
            temperature: 1.2,
            updatedAt: new Date(NOW)
        }));
    });

    it('should return a new object instead of the given sampler', () => {
        const sampler = createStoredSampler();

        const response = service.editSampler({ sampler, editParams: createEditParams() });

        expect(response.sampler).not.toBe(sampler);
    });

    it('should not mutate the given sampler', () => {
        const sampler = createStoredSampler();

        service.editSampler({
            sampler,
            editParams: createEditParams({ name: 'Renamed', observation: undefined })
        });

        expect(sampler).toStrictEqual(createStoredSampler());
    });

    it('should not mutate the given editParams', () => {
        const editParams = createEditParams({ name: 'Renamed' });

        service.editSampler({ sampler: createStoredSampler(), editParams });

        expect(editParams).toStrictEqual(createEditParams({ name: 'Renamed' }));
    });

    it('should leave blank fields to the use case validation', () => {
        const response = service.editSampler({
            sampler: createStoredSampler(),
            editParams: createEditParams({ name: '' })
        });

        expect(response.success).toBe(true);
        expect(response.sampler).toEqual(expect.objectContaining({ name: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.editSampler({
            sampler: createStoredSampler(),
            editParams: createEditParams({ name: '  Ação  🔥\n' })
        });

        expect(response.sampler?.name).toBe('Ação  🔥');
    });
});

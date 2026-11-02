import { CreateSamplerService } from '@application/services/sampler';
import { MirostatEnum } from '@domain/entities';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { CreateSamplerServiceParams } from '@domain/services';

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

const mockIdGenerator = {
    generate: jest.fn()
};

function createParams (): Required<CreateSamplerServiceParams> {
    return {
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
}

describe('CreateSamplerService', () => {
    let service: CreateSamplerService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        mockIdGenerator.generate.mockReturnValue('generated-id');
        service = new CreateSamplerService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.createSampler(createParams());

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Execute CreateSamplerService::createSampler');
    });

    it('should generate the id once', () => {
        service.createSampler(createParams());

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return only success and the created sampler with every entity field', () => {
        const params: Required<CreateSamplerServiceParams> = createParams();

        const response = service.createSampler(params);

        expect(response).toStrictEqual({
            success: true,
            sampler: {
                ...params,
                id: 'generated-id',
                systemDefault: false,
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should leave the optional fields undefined when they are omitted', () => {
        const response = service.createSampler({
            name: 'Creative'
        });

        expect(response.sampler?.observation).toBeUndefined();
        expect(response.sampler?.adaptiveDecay).toBeUndefined();
        expect(response.sampler?.adaptiveTarget).toBeUndefined();
        expect(response.sampler?.dryAllowedLength).toBeUndefined();
        expect(response.sampler?.dryBase).toBeUndefined();
        expect(response.sampler?.dryMultiplier).toBeUndefined();
        expect(response.sampler?.drySequenceBreakers).toBeUndefined();
        expect(response.sampler?.dynaTempExp).toBeUndefined();
        expect(response.sampler?.dynaTempRange).toBeUndefined();
        expect(response.sampler?.ignoreEOS).toBeUndefined();
        expect(response.sampler?.minP).toBeUndefined();
        expect(response.sampler?.mirostat).toBeUndefined();
        expect(response.sampler?.mirostatEnt).toBeUndefined();
        expect(response.sampler?.mirostatLr).toBeUndefined();
        expect(response.sampler?.frequencyPenalty).toBeUndefined();
        expect(response.sampler?.presencePenalty).toBeUndefined();
        expect(response.sampler?.repeatLastN).toBeUndefined();
        expect(response.sampler?.repeatPenalty).toBeUndefined();
        expect(response.sampler?.seed).toBeUndefined();
        expect(response.sampler?.temperature).toBeUndefined();
        expect(response.sampler?.topK).toBeUndefined();
        expect(response.sampler?.topNSigma).toBeUndefined();
        expect(response.sampler?.topP).toBeUndefined();
        expect(response.sampler?.typicalP).toBeUndefined();
        expect(response.sampler?.xtcProbability).toBeUndefined();
        expect(response.sampler?.xtcThreshold).toBeUndefined();
    });

    it('should never create a system default sampler', () => {
        const response = service.createSampler(createParams());

        expect(response.sampler?.systemDefault).toBe(false);
    });

    it('should trim the start and the end of the name', () => {
        const response = service.createSampler({ ...createParams(), name: '  Ação  🔥\n' });

        expect(response.sampler?.name).toBe('Ação  🔥');
    });

    it('should not mutate the given params', () => {
        const params = createParams();

        service.createSampler(params);

        expect(params).toStrictEqual(createParams());
    });
});

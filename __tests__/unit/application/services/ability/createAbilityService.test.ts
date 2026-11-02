import { CreateAbilityService } from '@application/services/ability';
import { ILogger } from '@domain/logger';
import { IIdGenerator } from '@domain/providers';
import { CreateAbilityServiceParams } from '@domain/services';

const NOW = '2026-06-15T12:00:00.000Z';
const LATER = '2026-06-16T08:30:00.000Z';

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

function createParams (): Required<CreateAbilityServiceParams> {
    return {
        name: 'Fireball',
        activationWord: 'combat',
        prompt: 'Deal fire damage to target',
        observation: 'Cannot be cast underwater'
    };
}

describe('CreateAbilityService', () => {
    let service: CreateAbilityService;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers({ now: new Date(NOW) });
        mockIdGenerator.generate.mockReturnValue('generated-id');
        service = new CreateAbilityService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should log the execution once', () => {
        service.createAbility(createParams());

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateAbilityService::createAbility');
    });

    it('should generate the id once', () => {
        service.createAbility(createParams());

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return only success and the created ability with every entity field', () => {
        const params: Required<CreateAbilityServiceParams> = createParams();

        const response = service.createAbility(params);

        expect(response).toStrictEqual({
            success: true,
            ability: {
                ...params,
                id: 'generated-id',
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should leave the observation undefined when it is omitted', () => {
        const response = service.createAbility({
            name: 'Fireball',
            activationWord: 'combat',
            prompt: 'Deal fire damage to target'
        });

        expect(response).toStrictEqual({
            success: true,
            ability: {
                name: 'Fireball',
                activationWord: 'combat',
                prompt: 'Deal fire damage to target',
                observation: undefined,
                id: 'generated-id',
                createdAt: new Date(NOW),
                updatedAt: new Date(NOW)
            }
        });
    });

    it('should keep an empty observation', () => {
        const response = service.createAbility({ ...createParams(), observation: '' });

        expect(response.ability?.observation).toBe('');
    });

    it('should keep empty text fields, since rejecting them is up to the use case', () => {
        const response = service.createAbility({ name: '', activationWord: '', prompt: '' });

        expect(response.ability).toEqual(expect.objectContaining({ name: '', activationWord: '', prompt: '' }));
    });

    it('should trim the start and the end of the name', () => {
        const response = service.createAbility({ ...createParams(), name: '  Fire  ball\n' });

        expect(response.ability?.name).toBe('Fire  ball');
    });

    it('should reduce a name made only of whitespace to an empty string', () => {
        const response = service.createAbility({ ...createParams(), name: ' \t\n ' });

        expect(response.ability?.name).toBe('');
    });

    it('should store the other text fields exactly as sent', () => {
        const response = service.createAbility({ ...createParams(), activationWord: ' fire ', prompt: ' Burn ' });

        expect(response.ability).toEqual(expect.objectContaining({ activationWord: ' fire ', prompt: ' Burn ' }));
    });

    it('should use the same Date instance for createdAt and updatedAt', () => {
        const response = service.createAbility(createParams());

        expect(response.ability?.createdAt).toBeInstanceOf(Date);
        expect(response.ability?.updatedAt).toBe(response.ability?.createdAt);
    });

    it('should give each call its own id and timestamps', () => {
        mockIdGenerator.generate.mockReturnValueOnce('first-id').mockReturnValueOnce('second-id');

        const firstResponse = service.createAbility(createParams());
        jest.setSystemTime(new Date(LATER));
        const secondResponse = service.createAbility(createParams());

        expect(firstResponse.ability).toEqual(expect.objectContaining({ id: 'first-id', createdAt: new Date(NOW), updatedAt: new Date(NOW) }));
        expect(secondResponse.ability).toEqual(expect.objectContaining({ id: 'second-id', createdAt: new Date(LATER), updatedAt: new Date(LATER) }));
    });

    it('should not mutate the given params', () => {
        const params = createParams();

        service.createAbility(params);

        expect(params).toStrictEqual(createParams());
    });
});

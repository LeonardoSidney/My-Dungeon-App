import { CreateAbilityService } from '@application/services/ability';
import {
    CreateAbilityServiceParams,
    CreateAbilityServiceReturn
} from '@domain/services';
import { ILogger } from '@domain/logger';
import { Ability } from '@domain/entities';
import { IIdGenerator } from '@domain/providers';
import { createAbilityHelper } from '../../../../__helpers__/createAbilityHelper';

// Mocks dos dependentes
const mockLogger = {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
};

const mockIdGenerator = {
    generate: jest.fn()
};

describe('CreateAbilityService', () => {
    let service: CreateAbilityService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new CreateAbilityService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call logger.info when creating an ability', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Fireball',
            activationWorld: 'combat',
            prompt: 'Deal fire damage to target'
        };

        mockIdGenerator.generate.mockReturnValue('ability-123');

        service.createAbility(params);

        expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateAbilityService::createAbility');
    });

    it('should call idGenerator.generate to create ability id', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Fireball',
            activationWorld: 'combat',
            prompt: 'Deal fire damage to target'
        };

        mockIdGenerator.generate.mockReturnValue('ability-456');

        service.createAbility(params);

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return success: true when ability is created', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Fireball',
            activationWorld: 'combat',
            prompt: 'Deal fire damage to target'
        };

        mockIdGenerator.generate.mockReturnValue('ability-789');

        const result: CreateAbilityServiceReturn = service.createAbility(params);

        expect(result.success).toBe(true);
    });

    it('should return ability with correct id', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Fireball',
            activationWorld: 'combat',
            prompt: 'Deal fire damage to target'
        };

        mockIdGenerator.generate.mockReturnValue('ability-abc');

        const result: CreateAbilityServiceReturn = service.createAbility(params);
        const ability: Ability = result.ability ?? createAbilityHelper();

        expect(ability.id).toBe('ability-abc');
    });

    it('should return ability with correct name', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Ice Storm',
            activationWorld: 'magic',
            prompt: 'Freeze enemies in area'
        };

        mockIdGenerator.generate.mockReturnValue('ability-ice');

        const result: CreateAbilityServiceReturn = service.createAbility(params);
        const ability: Ability = result.ability ?? createAbilityHelper();

        expect(ability.name).toBe('Ice Storm');
    });

    it('should return ability with correct activationWorld', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Shield',
            activationWorld: 'defense',
            prompt: 'Block incoming damage'
        };

        mockIdGenerator.generate.mockReturnValue('ability-shield');

        const result: CreateAbilityServiceReturn = service.createAbility(params);
        const ability: Ability = result.ability ?? createAbilityHelper();

        expect(ability.activationWorld).toBe('defense');
    });

    it('should return ability with correct prompt', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Heal',
            activationWorld: 'support',
            prompt: 'Restore health to ally'
        };

        mockIdGenerator.generate.mockReturnValue('ability-heal');

        const result: CreateAbilityServiceReturn = service.createAbility(params);
        const ability: Ability = result.ability ?? createAbilityHelper();

        expect(ability.prompt).toBe('Restore health to ally');
    });

    it('should return ability with correct observation when provided', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Stealth',
            activationWorld: 'infiltration',
            prompt: 'Become invisible',
            observation: 'Cannot be detected by normal senses'
        };

        mockIdGenerator.generate.mockReturnValue('ability-stealth');

        const result: CreateAbilityServiceReturn = service.createAbility(params);
        const ability: Ability = result.ability ?? createAbilityHelper();

        expect(ability.observation).toBe('Cannot be detected by normal senses');
    });

    it('should return ability with undefined observation when not provided', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Fireball',
            activationWorld: 'combat',
            prompt: 'Deal fire damage to target'
        };

        mockIdGenerator.generate.mockReturnValue('ability-fire');

        const result: CreateAbilityServiceReturn = service.createAbility(params);
        const ability: Ability = result.ability ?? createAbilityHelper();

        expect(ability.observation).toBeUndefined();
    });

    it('should set createdAt and updatedAt to same Date instance', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Lightning Bolt',
            activationWorld: 'combat',
            prompt: 'Strike target with lightning'
        };

        mockIdGenerator.generate.mockReturnValue('ability-lightning');

        const result: CreateAbilityServiceReturn = service.createAbility(params);
        const ability: Ability = result.ability ?? createAbilityHelper();

        expect(ability.createdAt).toBeInstanceOf(Date);
        expect(ability.updatedAt).toBeInstanceOf(Date);
        expect(ability.createdAt).toEqual(ability.updatedAt);
    });

    it('should return ability with all required fields', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Teleport',
            activationWorld: 'movement',
            prompt: 'Instantly move to target location'
        };

        mockIdGenerator.generate.mockReturnValue('ability-teleport');

        const result: CreateAbilityServiceReturn = service.createAbility(params);
        const ability: Ability = result.ability ?? createAbilityHelper();

        expect(ability).toHaveProperty('id');
        expect(ability).toHaveProperty('name');
        expect(ability).toHaveProperty('activationWorld');
        expect(ability).toHaveProperty('prompt');
        expect(ability).toHaveProperty('observation');
        expect(ability).toHaveProperty('createdAt');
        expect(ability).toHaveProperty('updatedAt');
    });

    it('should create ability with empty strings for name, activationWorld, and prompt', () => {
        const params: CreateAbilityServiceParams = {
            name: '',
            activationWorld: '',
            prompt: ''
        };

        mockIdGenerator.generate.mockReturnValue('ability-empty');

        const result: CreateAbilityServiceReturn = service.createAbility(params);
        const ability: Ability = result.ability ?? createAbilityHelper();

        expect(ability.name).toBe('');
        expect(ability.activationWorld).toBe('');
        expect(ability.prompt).toBe('');
    });

    it('should create ability when observation is empty string', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Test Ability',
            activationWorld: 'test',
            prompt: 'Test prompt',
            observation: ''
        };

        mockIdGenerator.generate.mockReturnValue('ability-empty-obs');

        const result: CreateAbilityServiceReturn = service.createAbility(params);
        const ability: Ability = result.ability ?? createAbilityHelper();

        expect(ability.observation).toBe('');
    });

    it('should call logger.info exactly once per createAbility call', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Dragon Breath',
            activationWorld: 'combat',
            prompt: 'Breathe dragon fire'
        };

        mockIdGenerator.generate.mockReturnValue('ability-dragon');

        service.createAbility(params);

        expect(mockLogger.info).toHaveBeenCalledTimes(1);
    });

    it('should call idGenerator.generate exactly once per createAbility call', () => {
        const params: CreateAbilityServiceParams = {
            name: 'Warp Strike',
            activationWorld: 'combat',
            prompt: 'Teleport and strike enemy'
        };

        mockIdGenerator.generate.mockReturnValue('ability-warp');

        service.createAbility(params);

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return createdAt and updatedAt as Date instances for separate calls', () => {
        mockIdGenerator.generate.mockReturnValue('ability-1');

        const params1: CreateAbilityServiceParams = {
            name: 'Ability 1',
            activationWorld: 'test',
            prompt: 'Prompt 1'
        };

        const params2: CreateAbilityServiceParams = {
            name: 'Ability 2',
            activationWorld: 'test',
            prompt: 'Prompt 2'
        };

        const result1: CreateAbilityServiceReturn = service.createAbility(params1);
        const result2: CreateAbilityServiceReturn = service.createAbility(params2);
        const ability1: Ability = result1.ability ?? createAbilityHelper();
        const ability2: Ability = result2.ability ?? createAbilityHelper();

        expect(ability1.createdAt).toBeInstanceOf(Date);
        expect(ability1.updatedAt).toBeInstanceOf(Date);
        expect(ability2.createdAt).toBeInstanceOf(Date);
        expect(ability2.updatedAt).toBeInstanceOf(Date);
    });
});

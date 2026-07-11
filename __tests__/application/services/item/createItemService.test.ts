import { CreateItemService } from '@application/services/item';
import {
    CreateItemServiceParams,
    CreateItemServiceResponse
} from '@domain/services';
import { IIdGenerator } from '@domain/providers';
import { ILogger } from '@domain/logger';
import { createItemHelper } from '../../../../__helpers__/createItemHelper';
import { createItemServiceResponseHelper } from '../../../../__helpers__/createItemServiceResponseHelper';

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

describe('CreateItemService', () => {
    let service: CreateItemService;

    beforeEach(() => {
        jest.clearAllMocks();
        service = new CreateItemService(
            mockLogger as unknown as ILogger,
            mockIdGenerator as unknown as IIdGenerator
        );
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should call logger.info when creating an item', () => {
        const params: CreateItemServiceParams = {
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Test prompt',
            observation: 'Test observation'
        };

        mockIdGenerator.generate.mockReturnValue('item-123');

        service.createItem(params);

        expect(mockLogger.info).toHaveBeenCalledWith('CreateItemService::createItem');
    });

    it('should call idGenerator.generate to create item id', () => {
        const params: CreateItemServiceParams = {
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Test prompt',
            observation: 'Test observation'
        };

        mockIdGenerator.generate.mockReturnValue('item-456');

        service.createItem(params);

        expect(mockIdGenerator.generate).toHaveBeenCalledTimes(1);
    });

    it('should return success: true when item is created', () => {
        const params: CreateItemServiceParams = {
            name: 'Test Item',
            activationWord: 'activate',
            prompt: 'Test prompt',
            observation: 'Test observation'
        };

        mockIdGenerator.generate.mockReturnValue('item-789');

        const result: CreateItemServiceResponse = service.createItem(params);

        expect(result.success).toBe(true);
    });

    it('should return item with correct properties', () => {
        const params: CreateItemServiceParams = {
            name: 'Magic Sword',
            activationWord: 'slash',
            prompt: 'A magical sword that glows',
            observation: 'An ancient blade'
        };

        mockIdGenerator.generate.mockReturnValue('item-abc');

        const expectedItem = createItemHelper({
            id: 'item-abc',
            name: 'Magic Sword',
            activationWord: 'slash',
            prompt: 'A magical sword that glows',
            observation: 'An ancient blade'
        });

        const expectedResult = createItemServiceResponseHelper({
            success: true,
            item: expectedItem
        });

        const result = service.createItem(params);

        expect(result).toEqual(expectedResult);
    });
});

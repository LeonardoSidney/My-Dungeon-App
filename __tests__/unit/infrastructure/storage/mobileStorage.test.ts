import AsyncStorage from '@react-native-async-storage/async-storage';
import { MobileStorage } from '@infra/storage';
import { ILogger } from '@domain/logger';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    getMany: jest.fn(),
    setMany: jest.fn(),
    removeItem: jest.fn(),
    removeMany: jest.fn(),
}));

const mockLogger: ILogger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;
const mockGetMany = AsyncStorage.getMany as jest.Mock;
const mockSetMany = AsyncStorage.setMany as jest.Mock;
const mockRemoveItem = AsyncStorage.removeItem as jest.Mock;
const mockRemoveMany = AsyncStorage.removeMany as jest.Mock;

describe('MobileStorage', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('load', () => {
        it('returns the parsed value', async () => {
            mockGetItem.mockResolvedValue(JSON.stringify([{ id: '1' }]));

            const result = await new MobileStorage(mockLogger).load('key');

            expect(result).toEqual({ success: true, data: [{ id: '1' }] });
        });

        it('returns null data when nothing is stored', async () => {
            mockGetItem.mockResolvedValue(null);

            const result = await new MobileStorage(mockLogger).load('key');

            expect(result).toEqual({ success: true, data: null });
        });

        it('turns a storage exception into an error result', async () => {
            mockGetItem.mockRejectedValue(new Error('disk failure'));

            const result = await new MobileStorage(mockLogger).load('key');

            expect(result).toEqual({ success: false, error: 'Failed to load key' });
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('turns a corrupted value into an error result', async () => {
            mockGetItem.mockResolvedValue('{not json');

            const result = await new MobileStorage(mockLogger).load('key');

            expect(result).toEqual({ success: false, error: 'Failed to load key' });
        });

        it('logs the size and the duration of the read', async () => {
            mockGetItem.mockResolvedValue('[1]');

            await new MobileStorage(mockLogger).load('key');

            expect(mockLogger.storage).toHaveBeenCalledWith('MobileStorage::load - measurement', { name: 'key', size: 3, durationMs: expect.any(Number) });
        });

        it('logs an empty read with size zero', async () => {
            mockGetItem.mockResolvedValue(null);

            await new MobileStorage(mockLogger).load('key');

            expect(mockLogger.storage).toHaveBeenCalledWith('MobileStorage::load - measurement', { name: 'key', size: 0, durationMs: expect.any(Number) });
        });
    });

    describe('loadMany', () => {
        it('returns each parsed value under its name', async () => {
            mockGetMany.mockResolvedValue({ first: '[1]', second: '[2]' });

            const result = await new MobileStorage(mockLogger).loadMany(['first', 'second']);

            expect(mockGetMany).toHaveBeenCalledWith(['first', 'second']);
            expect(result).toEqual({ success: true, data: { first: [1], second: [2] } });
        });

        it('returns null for a name that is not stored', async () => {
            mockGetMany.mockResolvedValue({ first: null });

            const result = await new MobileStorage(mockLogger).loadMany(['first', 'second']);

            expect(result).toEqual({ success: true, data: { first: null, second: null } });
        });

        it('keeps the other values when one is corrupted', async () => {
            mockGetMany.mockResolvedValue({ first: '{not json', second: '[2]' });

            const result = await new MobileStorage(mockLogger).loadMany(['first', 'second']);

            expect(result).toEqual({ success: true, data: { first: null, second: [2] } });
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('turns a storage exception into an error result', async () => {
            mockGetMany.mockRejectedValue(new Error('disk failure'));

            const result = await new MobileStorage(mockLogger).loadMany(['first', 'second']);

            expect(result).toEqual({ success: false, error: 'Failed to load first, second' });
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('save', () => {
        it('serializes and stores the value', async () => {
            mockSetItem.mockResolvedValue(undefined);

            const result = await new MobileStorage(mockLogger).save('key', [{ id: '1' }]);

            expect(result).toEqual({ success: true });
            expect(mockSetItem).toHaveBeenCalledWith('key', JSON.stringify([{ id: '1' }]));
        });

        it('turns a storage exception into an error result', async () => {
            mockSetItem.mockRejectedValue(new Error('quota exceeded'));

            const result = await new MobileStorage(mockLogger).save('key', []);

            expect(result).toEqual({ success: false, error: 'Failed to save key' });
            expect(mockLogger.error).toHaveBeenCalled();
        });

        it('logs the size and the duration of the write', async () => {
            mockSetItem.mockResolvedValue(undefined);

            await new MobileStorage(mockLogger).save('key', [1]);

            expect(mockLogger.storage).toHaveBeenCalledWith('MobileStorage::save - measurement', { name: 'key', size: 3, durationMs: expect.any(Number) });
        });
    });

    describe('saveMany', () => {
        it('serializes and stores every value in one call', async () => {
            mockSetMany.mockResolvedValue(undefined);

            const result = await new MobileStorage(mockLogger).saveMany({ first: [1], second: { id: '2' } });

            expect(result).toEqual({ success: true });
            expect(mockSetMany).toHaveBeenCalledTimes(1);
            expect(mockSetMany).toHaveBeenCalledWith({ first: '[1]', second: '{"id":"2"}' });
        });

        it('turns a storage exception into an error result', async () => {
            mockSetMany.mockRejectedValue(new Error('quota exceeded'));

            const result = await new MobileStorage(mockLogger).saveMany({ first: [1], second: [2] });

            expect(result).toEqual({ success: false, error: 'Failed to save first, second' });
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('remove', () => {
        it('removes the value', async () => {
            mockRemoveItem.mockResolvedValue(undefined);

            const result = await new MobileStorage(mockLogger).remove('key');

            expect(result).toEqual({ success: true });
            expect(mockRemoveItem).toHaveBeenCalledWith('key');
        });

        it('turns a storage exception into an error result', async () => {
            mockRemoveItem.mockRejectedValue(new Error('disk failure'));

            const result = await new MobileStorage(mockLogger).remove('key');

            expect(result).toEqual({ success: false, error: 'Failed to remove key' });
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });

    describe('removeMany', () => {
        it('removes every value in one call', async () => {
            mockRemoveMany.mockResolvedValue(undefined);

            const result = await new MobileStorage(mockLogger).removeMany(['first', 'second']);

            expect(result).toEqual({ success: true });
            expect(mockRemoveMany).toHaveBeenCalledWith(['first', 'second']);
        });

        it('turns a storage exception into an error result', async () => {
            mockRemoveMany.mockRejectedValue(new Error('disk failure'));

            const result = await new MobileStorage(mockLogger).removeMany(['first', 'second']);

            expect(result).toEqual({ success: false, error: 'Failed to remove first, second' });
            expect(mockLogger.error).toHaveBeenCalled();
        });
    });
});

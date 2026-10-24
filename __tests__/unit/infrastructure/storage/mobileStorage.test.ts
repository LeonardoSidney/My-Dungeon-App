import AsyncStorage from '@react-native-async-storage/async-storage';
import { MobileStorage } from '@infra/storage';
import { ILogger } from '@domain/logger';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

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
    });
});

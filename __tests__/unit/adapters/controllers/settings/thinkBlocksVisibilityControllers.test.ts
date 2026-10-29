import { GetThinkBlocksVisibilityController, SaveThinkBlocksVisibilityController } from '@adapters/controllers';
import { ILogger } from '@domain/logger';

const logger = {
    debug: jest.fn(),
    storage: jest.fn(),
    streaming: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
} as unknown as ILogger;

describe('think blocks visibility controllers', () => {
    it('returns the visibility from the get use case', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, showThinkBlocks: false });

        const response = await new GetThinkBlocksVisibilityController(logger, { execute }).handle();

        expect(response).toEqual({ success: true, showThinkBlocks: false });
    });

    it('forwards the save request', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, showThinkBlocks: true });

        const response = await new SaveThinkBlocksVisibilityController(logger, { execute }).handle({ showThinkBlocks: true });

        expect(execute).toHaveBeenCalledWith({ showThinkBlocks: true });
        expect(response).toEqual({ success: true, showThinkBlocks: true });
    });
});

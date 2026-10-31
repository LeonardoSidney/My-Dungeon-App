import { GetSceneContextEnabledController, SaveSceneContextEnabledController } from '@adapters/controllers';
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

describe('scene context enabled controllers', () => {
    it('returns the setting from the get use case', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, sceneContextEnabled: false });

        const response = await new GetSceneContextEnabledController(logger, { execute }).handle();

        expect(response).toEqual({ success: true, sceneContextEnabled: false });
    });

    it('forwards the save request', async () => {
        const execute = jest.fn().mockResolvedValue({ success: true, sceneContextEnabled: true });

        const response = await new SaveSceneContextEnabledController(logger, { execute }).handle({ sceneContextEnabled: true });

        expect(execute).toHaveBeenCalledWith({ sceneContextEnabled: true });
        expect(response).toEqual({ success: true, sceneContextEnabled: true });
    });
});

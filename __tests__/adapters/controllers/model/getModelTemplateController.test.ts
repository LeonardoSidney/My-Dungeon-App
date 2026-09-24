import { GetModelTemplateController } from '@adapters/controllers';
import { IGetModelTemplateUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { createConnectionHelper, createModelTemplateHelper } from '@test/helpers';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

const mockUseCase = {
    execute: jest.fn()
};

describe('GetModelTemplateController', () => {
    let controller: GetModelTemplateController;

    beforeEach(() => {
        controller = new GetModelTemplateController(mockLogger, mockUseCase as unknown as IGetModelTemplateUseCase);
        jest.clearAllMocks();
    });

    it('logs the execution start', async () => {
        mockUseCase.execute.mockResolvedValue({ success: true, modelTemplate: createModelTemplateHelper() });

        await controller.handle({ connection: createConnectionHelper(), modelId: 'model-a' });

        expect(mockLogger.info).toHaveBeenCalledWith('Executing GetModelTemplateController::handle');
    });

    it('passes connection and modelId to the use case', async () => {
        mockUseCase.execute.mockResolvedValue({ success: true });
        const connection = createConnectionHelper();

        await controller.handle({ connection, modelId: 'model-a' });

        expect(mockUseCase.execute).toHaveBeenCalledWith({ connection, modelId: 'model-a' });
    });

    it('returns the model template on success', async () => {
        const modelTemplate = createModelTemplateHelper();
        mockUseCase.execute.mockResolvedValue({ success: true, modelTemplate });

        const result = await controller.handle({ connection: createConnectionHelper(), modelId: 'model-a' });

        expect(result).toEqual({ success: true, modelTemplate });
    });

    it('returns the error on failure', async () => {
        mockUseCase.execute.mockResolvedValue({ success: false, error: 'model is not loaded' });

        const result = await controller.handle({ connection: createConnectionHelper(), modelId: 'model-a' });

        expect(result).toEqual({ success: false, error: 'model is not loaded' });
    });
});

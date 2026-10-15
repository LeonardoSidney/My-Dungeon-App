import { EraseSystemPromptController } from '@adapters/controllers';
import { IEraseSystemPromptUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';

const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  warning: jest.fn()
};

const mockUseCase = {
  execute: jest.fn()
};

describe('EraseSystemPromptController', () => {
  let controller: EraseSystemPromptController;

  beforeEach(() => {
    controller = new EraseSystemPromptController(mockLogger as unknown as ILogger, mockUseCase as unknown as IEraseSystemPromptUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call logger.info when handling a request', async () => {
    mockUseCase.execute.mockResolvedValue({
      success: true
    });

    await controller.handle('1');

    expect(mockLogger.info).toHaveBeenCalledWith('Executing EraseSystemPromptController::handle');
  });

  it('should call useCase.execute with the system prompt id', async () => {
    mockUseCase.execute.mockResolvedValue({
      success: true
    });

    await controller.handle('1');

    expect(mockUseCase.execute).toHaveBeenCalledWith('1');
  });

  it('should return success when use case succeeds', async () => {
    mockUseCase.execute.mockResolvedValue({
      success: true
    });

    const response = await controller.handle('1');

    expect(response).toEqual({ success: true });
  });

  it('should return error when use case fails', async () => {
    mockUseCase.execute.mockResolvedValue({
      success: false,
      error: 'Failed to erase system prompt'
    });

    const response = await controller.handle('1');

    expect(response).toEqual({
      success: false,
      error: 'Failed to erase system prompt'
    });
  });
});

import { GetStatusesController } from '../../../../src/adapters/controllers/status/getStatusesController';
import { IGetStatusesUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Status } from '@domain/entities';

// Mock das dependências
const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn()
};

const mockUseCase = {
  execute: jest.fn()
};

describe('GetStatusesController', () => {
  let controller: GetStatusesController;

  beforeEach(() => {
    controller = new GetStatusesController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetStatusesUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call logger.info when handling a request', async () => {
    const mockStatuses: Status[] = [
      {
        id: '1',
        name: 'Status 1',
        prompt: 'Prompt 1',
        activationWord: 'activate1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Status 2',
        prompt: 'Prompt 2',
        activationWord: 'activate2',
        observation: 'Test observation',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    mockUseCase.execute.mockResolvedValue(mockStatuses);

    await controller.handle();

    expect(mockLogger.info).toHaveBeenCalledWith('Executing GetStatusesController::handle');
  });

  it('should call useCase.execute when handling a request', async () => {
    const mockStatuses: Status[] = [
      {
        id: '1',
        name: 'Status 1',
        prompt: 'Prompt 1',
        activationWord: 'activate1',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    mockUseCase.execute.mockResolvedValue(mockStatuses);

    await controller.handle();

    expect(mockUseCase.execute).toHaveBeenCalled();
  });

  it('should return statuses array when use case succeeds', async () => {
    const mockStatuses: Status[] = [
      {
        id: '1',
        name: 'Status 1',
        prompt: 'Prompt 1',
        activationWord: 'activate1',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Status 2',
        prompt: 'Prompt 2',
        activationWord: 'activate2',
        observation: 'Test observation',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    mockUseCase.execute.mockResolvedValue(mockStatuses);

    const response = await controller.handle();

    expect(response).toEqual(mockStatuses);
    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBe(2);
  });

  it('should return empty array when no statuses exist', async () => {
    mockUseCase.execute.mockResolvedValue([]);

    const response = await controller.handle();

    expect(response).toEqual([]);
    expect(Array.isArray(response)).toBe(true);
    expect(response.length).toBe(0);
  });
});

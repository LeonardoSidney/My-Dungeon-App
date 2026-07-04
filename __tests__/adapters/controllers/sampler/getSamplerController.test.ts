import { GetSamplersController } from '../../../../src/adapters/controllers/sampler/getSamplerController';
import { IGetSamplersUseCase } from '@domain/use-cases';
import { ILogger } from '@domain/logger';
import { Sampler } from '@domain/entities';

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

describe('GetSamplersController', () => {
  let controller: GetSamplersController;

  beforeEach(() => {
    controller = new GetSamplersController(mockLogger as unknown as ILogger, mockUseCase as unknown as IGetSamplersUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call logger.info when handling a request', async () => {
    const mockSamplers: Sampler[] = [
      {
        id: '1',
        name: 'Sampler 1',
        observation: 'Test observation',
        systemDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    mockUseCase.execute.mockResolvedValue(mockSamplers);

    await controller.handle();

    expect(mockLogger.info).toHaveBeenCalledWith('Executing GetSamplersController::handle');
  });

  it('should call useCase.execute when handling a request', async () => {
    const mockSamplers: Sampler[] = [
      {
        id: '1',
        name: 'Sampler 1',
        observation: 'Test observation',
        systemDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    mockUseCase.execute.mockResolvedValue(mockSamplers);

    await controller.handle();

    expect(mockUseCase.execute).toHaveBeenCalled();
  });

  it('should return samplers array when use case succeeds', async () => {
    const mockSamplers: Sampler[] = [
      {
        id: '1',
        name: 'Sampler 1',
        observation: 'Test observation 1',
        systemDefault: false,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Sampler 2',
        observation: 'Test observation 2',
        systemDefault: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    mockUseCase.execute.mockResolvedValue(mockSamplers);

    const result = await controller.handle();

    expect(result).toEqual(mockSamplers);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Sampler 1');
    expect(result[1].name).toBe('Sampler 2');
  });

  it('should return empty array when no samplers exist', async () => {
    mockUseCase.execute.mockResolvedValue([]);

    const result = await controller.handle();

    expect(result).toEqual([]);
    expect(result.length).toBe(0);
  });
});

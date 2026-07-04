import { CreateSamplerController } from '../../../../src/adapters/controllers/sampler/createSamplerController';
import { ICreateSamplerUseCase } from '@domain/use-cases';
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

describe('CreateSamplerController', () => {
  let controller: CreateSamplerController;

  beforeEach(() => {
    controller = new CreateSamplerController(mockLogger as unknown as ILogger, mockUseCase as unknown as ICreateSamplerUseCase);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call logger.info when handling a request', async () => {
    const mockSampler: Sampler = {
      id: '1',
      name: 'Test Sampler',
      observation: 'Test observation',
      systemDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUseCase.execute.mockResolvedValue({
      success: true,
      sampler: mockSampler
    });

    await controller.handle({
      name: 'Test Sampler',
      observation: 'Test observation'
    });

    expect(mockLogger.info).toHaveBeenCalledWith('Executing CreateSamplerController::handle');
  });

  it('should call useCase.execute with correct params when handling a request', async () => {
    const mockSampler: Sampler = {
      id: '1',
      name: 'Test Sampler',
      observation: 'Test observation',
      systemDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUseCase.execute.mockResolvedValue({
      success: true,
      sampler: mockSampler
    });

    const params = {
      name: 'Test Sampler',
      observation: 'Test observation',
      temperature: 0.8,
      topP: 0.9,
      topK: 50
    };

    await controller.handle(params);

    expect(mockUseCase.execute).toHaveBeenCalledWith(params);
  });

  it('should return sampler when use case succeeds', async () => {
    const mockSampler: Sampler = {
      id: '1',
      name: 'Test Sampler',
      observation: 'Test observation',
      systemDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUseCase.execute.mockResolvedValue({
      success: true,
      sampler: mockSampler
    });

    const response = await controller.handle({
      name: 'Test Sampler',
      observation: 'Test observation'
    });

    expect(response.success).toBe(true);
    expect(response.sampler).toEqual(mockSampler);
    expect(response.error).toBeUndefined();
  });

  it('should return error when use case fails', async () => {
    mockUseCase.execute.mockResolvedValue({
      success: false,
      error: 'Failed to create sampler'
    });

    const response = await controller.handle({
      name: 'Test Sampler'
    });

    expect(response.success).toBe(false);
    expect(response.error).toBe('Failed to create sampler');
    expect(response.sampler).toBeUndefined();
  });

  it('should pass all sampler params to use case', async () => {
    const mockSampler: Sampler = {
      id: '1',
      name: 'Full Sampler',
      observation: 'Full test',
      systemDefault: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    mockUseCase.execute.mockResolvedValue({
      success: true,
      sampler: mockSampler
    });

    const params = {
      name: 'Full Sampler',
      observation: 'Full test',
      adaptativeDecay: 0.5,
      adaptativeTarget: 0.8,
      dryAllowedLenght: 64,
      dryBase: 1.0,
      dryMultiplier: 0.5,
      drySequenceBreakers: ['"', "'"],
      dynaTempExp: 1.0,
      dynaTempRange: 2.0,
      ignoreEOS: true,
      minP: 0.1,
      mirostat: 1,
      mirostatEnt: 5.0,
      mirostatLr: 0.1,
      frequencyPenalty: 0.5,
      presencePenalty: 0.5,
      repeatLastN: 64,
      repeatPenalty: 1.0,
      seed: '12345',
      temperature: 0.8,
      topK: 50,
      topNSigma: 0.0,
      topP: 0.9,
      typicalP: 0.5,
      xtcProbability: 0.0,
      xtcThreshould: 0.1
    };

    const response = await controller.handle(params);

    expect(mockUseCase.execute).toHaveBeenCalledWith(params);
    expect(response.success).toBe(true);
    expect(response.sampler).toEqual(mockSampler);
  });
});

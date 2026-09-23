import { AlertWebUseCase } from '@application/use-cases';
import { IAlertChannel } from '@domain/providers';
import { ILogger } from '@domain/logger';

const mockLogger: ILogger = {
  debug: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  log: jest.fn()
};

const mockChannel = {
  publish: jest.fn()
};

function buildUseCase (): AlertWebUseCase {
  return new AlertWebUseCase(
    mockLogger,
    mockChannel as unknown as IAlertChannel
  );
}

describe('AlertWebUseCase', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should publish the alert params on the channel', () => {
    const useCase = buildUseCase();

    useCase.execute({ title: 'Erro', message: 'Failed to save' });

    expect(mockChannel.publish).toHaveBeenCalledTimes(1);
    expect(mockChannel.publish).toHaveBeenCalledWith({ title: 'Erro', message: 'Failed to save' });
  });

  it('should log the execution', () => {
    const useCase = buildUseCase();

    useCase.execute({ title: 'Erro', message: 'Failed to save' });

    expect(mockLogger.info).toHaveBeenCalledWith('Executing AlertWebUseCase::execute');
  });
});

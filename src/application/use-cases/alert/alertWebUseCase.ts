import { ILogger } from '@domain/logger';
import { IAlertChannel } from '@domain/providers';
import { AlertUseCaseParams, IAlertUseCase } from '@domain/use-cases';

export class AlertWebUseCase implements IAlertUseCase {
  constructor (
    private readonly logger: ILogger,
    private readonly channel: IAlertChannel
  ) { }

  execute (params: AlertUseCaseParams): void {
    this.logger.info('Executing AlertWebUseCase::execute');
    this.channel.publish(params);
  }
}

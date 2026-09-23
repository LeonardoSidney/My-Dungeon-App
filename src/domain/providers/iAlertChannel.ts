import { AlertUseCaseParams } from '@domain/use-cases';

export interface IAlertChannel {
  publish (params: AlertUseCaseParams): void;
}

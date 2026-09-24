import { IAlertChannel } from '@domain/providers';
import { AlertUseCaseParams } from '@domain/use-cases';

export type AlertSubscriber = (params: AlertUseCaseParams) => void;

export class AlertBus implements IAlertChannel {
    private subscribers: AlertSubscriber[] = [];

    publish (params: AlertUseCaseParams): void {
        this.subscribers.forEach((subscriber) => subscriber(params));
    }

    subscribe (subscriber: AlertSubscriber): () => void {
        this.subscribers.push(subscriber);

        return () => {
            this.subscribers = this.subscribers.filter((existing) => existing !== subscriber);
        };
    }
}

export const alertBus = new AlertBus();

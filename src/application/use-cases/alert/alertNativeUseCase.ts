import { Alert } from 'react-native';
import { ILogger } from '@domain/logger';
import { IAlertUseCase } from '@domain/use-cases';

export class AlertNativeUseCase implements IAlertUseCase {
    constructor (
        private readonly logger: ILogger
    ) { }

    execute (params: { title: string; message: string; }): void {
        this.logger.info('Executing AlertNativeUseCase::execute');
        Alert.alert(params.title, params.message);
    }
}

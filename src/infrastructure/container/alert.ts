import { AlertController } from '@adapters/controllers';
import { alertBus } from '@application/alerts';
import { AlertNativeUseCase, AlertWebUseCase } from '@application/use-cases';
import { IAlertController } from '@domain/controllers';
import { IAlertUseCase } from '@domain/use-cases';
import { Platform } from 'react-native';
import { logger } from './shared';

export function getAlertUseCase (): IAlertUseCase {
    if (Platform.OS === 'web') {
        return new AlertWebUseCase(logger, alertBus);
    }

    return new AlertNativeUseCase(logger);
}

export function createAlertController (): IAlertController {
    return new AlertController(logger, getAlertUseCase());
}

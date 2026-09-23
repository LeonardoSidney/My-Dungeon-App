import { AlertController } from '@adapters/controllers';
import { AlertNativeUseCase } from '@application/use-cases';
import { IAlertController } from '@domain/controllers';
import { IAlertUseCase } from '@domain/use-cases';
import { Platform } from 'react-native';
import { logger } from './shared';

export function getAlertUseCase (): IAlertUseCase {
    if (Platform.OS === 'web') {
        return new AlertNativeUseCase(logger);
    }

    return new AlertNativeUseCase(logger);
}

export function createAlertController (): IAlertController {
    return new AlertController(logger, getAlertUseCase());
}

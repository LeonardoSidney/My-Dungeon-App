import { Platform } from 'react-native';
import { AlertController } from '@adapters/controllers';
import { AlertNativeUseCase, AlertWebUseCase } from '@application/use-cases';
import { createAlertController, getAlertUseCase } from '@infra/container/alert';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

describe('alert container', () => {
    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('alerts natively on native platforms', () => {
        jest.replaceProperty(Platform, 'OS', 'ios');

        expect(getAlertUseCase()).toBeInstanceOf(AlertNativeUseCase);
    });

    it('alerts through the alert bus on the web', () => {
        jest.replaceProperty(Platform, 'OS', 'web');

        expect(getAlertUseCase()).toBeInstanceOf(AlertWebUseCase);
    });

    it('builds the alert controller', () => {
        expect(createAlertController()).toBeInstanceOf(AlertController);
    });
});

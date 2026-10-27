import { Alert } from 'react-native';
import { AlertNativeUseCase } from '@application/use-cases';
import { AlertActionStyleEnum } from '@domain/use-cases';
import { ILogger } from '@domain/logger';

const mockLogger: ILogger = {
    debug: jest.fn(),
    info: jest.fn(),
    warning: jest.fn(),
    error: jest.fn(),
    log: jest.fn()
};

describe('AlertNativeUseCase', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(Alert, 'alert').mockImplementation(() => undefined);
    });

    it('shows the alert with the default button when it has no actions', () => {
        new AlertNativeUseCase(mockLogger).execute({ title: 'Saved', message: 'The adventure was saved' });

        expect(Alert.alert).toHaveBeenCalledWith('Saved', 'The adventure was saved', undefined);
        expect(mockLogger.info).toHaveBeenCalledWith('Executing AlertNativeUseCase::execute');
    });

    it('turns the actions into buttons', () => {
        const onPress = jest.fn();

        new AlertNativeUseCase(mockLogger).execute({
            title: 'Open link?',
            message: 'This link leaves the app and opens example.com.',
            actions: [
                { label: 'Cancel', style: AlertActionStyleEnum.CANCEL },
                { label: 'Open', onPress },
            ],
        });

        expect(Alert.alert).toHaveBeenCalledWith('Open link?', 'This link leaves the app and opens example.com.', [
            { text: 'Cancel', style: 'cancel', onPress: undefined },
            { text: 'Open', style: 'default', onPress },
        ]);
    });
});

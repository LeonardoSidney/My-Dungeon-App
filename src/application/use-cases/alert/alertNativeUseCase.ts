import { Alert, AlertButton } from 'react-native';
import { ILogger } from '@domain/logger';
import { AlertAction, AlertActionStyle, AlertActionStyleEnum, AlertUseCaseParams, IAlertUseCase } from '@domain/use-cases';

export class AlertNativeUseCase implements IAlertUseCase {
    constructor (
        private readonly logger: ILogger
    ) { }

    execute (params: AlertUseCaseParams): void {
        this.logger.info('Executing AlertNativeUseCase::execute');
        const buttons = params.actions?.map(action => this.toButton(action));
        Alert.alert(params.title, params.message, buttons);
    }

    private toButton (action: AlertAction): AlertButton {
        return {
            text: action.label,
            style: this.toButtonStyle(action.style),
            onPress: action.onPress,
        };
    }

    private toButtonStyle (style?: AlertActionStyle): AlertButton['style'] {
        if (style === AlertActionStyleEnum.CANCEL) {
            return 'cancel';
        }

        return 'default';
    }
}

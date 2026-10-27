export enum AlertActionStyleEnum {
    DEFAULT = 'default',
    CANCEL = 'cancel',
}

export type AlertActionStyle = AlertActionStyleEnum.DEFAULT | AlertActionStyleEnum.CANCEL;

export type AlertAction = {
    label: string;
    style?: AlertActionStyle;
    onPress?: () => void;
};

export type AlertUseCaseParams = {
    title: string;
    message: string;
    actions?: AlertAction[];
};

export interface IAlertUseCase {
    execute(params: AlertUseCaseParams): void;
}

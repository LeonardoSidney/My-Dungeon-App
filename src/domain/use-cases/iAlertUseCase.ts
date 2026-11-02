export enum AlertActionStyleEnum {
    DEFAULT = 'default',
    CANCEL = 'cancel',
    DESTRUCTIVE = 'destructive',
}

export type AlertActionStyle = AlertActionStyleEnum.DEFAULT | AlertActionStyleEnum.CANCEL | AlertActionStyleEnum.DESTRUCTIVE;

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

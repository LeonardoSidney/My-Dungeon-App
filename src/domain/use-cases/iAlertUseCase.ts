export type AlertUseCaseParams = {
    title: string;
    message: string;
};

export interface IAlertUseCase {
    execute(params: AlertUseCaseParams): void;
}

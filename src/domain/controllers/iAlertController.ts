export interface IAlertController {
    handle(params: AlertControllerParams): Promise<void>;
}

export type AlertControllerParams = {
    title: string;
    message: string;
};

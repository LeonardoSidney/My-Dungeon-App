export interface IRecoverInterruptedRepliesController {
    handle (): Promise<RecoverInterruptedRepliesControllerResponse>;
}

export type RecoverInterruptedRepliesControllerResponse = {
    success: boolean;
    error?: string;
};

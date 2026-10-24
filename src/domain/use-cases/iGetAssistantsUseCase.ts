import { Assistant } from '../entities';

export interface IGetAssistantsUseCase {
    execute (): Promise<GetAssistantsUseCaseReturn>;
}

export type GetAssistantsUseCaseReturn = {
    success: boolean;
    assistants?: Assistant[];
    error?: string;
};

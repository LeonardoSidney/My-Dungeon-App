import { SystemPrompt } from '../entities';

export interface IGetSystemPromptsUseCase {
    execute(): Promise<SystemPrompt[]>;
}

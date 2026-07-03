import { SystemPrompt } from '../entities';

export interface IGetSystemPromptsController {
    handle(): Promise<SystemPrompt[]>;
}

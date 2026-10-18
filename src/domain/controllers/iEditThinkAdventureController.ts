import { Adventure, Chat } from '@domain/entities';

export interface IEditThinkAdventureController {
  handle (request: EditThinkControllerRequest): Promise<EditThinkControllerResponse>;
}

export type EditThinkControllerRequest = {
  adventure: Adventure;
  chatId: string;
  content: string;
};

export type EditThinkControllerResponse = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

import { Adventure, Chat } from '@domain/entities';

export interface IDeleteThinkAdventureController {
  handle (request: DeleteThinkControllerRequest): Promise<DeleteThinkControllerResponse>;
}

export type DeleteThinkControllerRequest = {
  adventure: Adventure;
  chatId: string;
  index: number;
};

export type DeleteThinkControllerResponse = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

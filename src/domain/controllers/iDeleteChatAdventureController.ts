import { Adventure, Chat } from '@domain/entities';

export interface IDeleteChatAdventureController {
  handle (request: DeleteChatControllerRequest): Promise<DeleteChatControllerResponse>;
}

export type DeleteChatControllerRequest = {
  adventure: Adventure;
  chatId: string;
  index: number;
};

export type DeleteChatControllerResponse = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

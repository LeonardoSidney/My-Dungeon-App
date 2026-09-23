import { Adventure, Chat } from '@domain/entities';

export interface IDeleteChatAdventureService {
  deleteChat (params: DeleteChatAdventureServiceParams): DeleteChatAdventureServiceReturn;
}

export type DeleteChatAdventureServiceParams = {
  adventure: Adventure;
  chatId: string;
  index: number;
};

export type DeleteChatAdventureServiceReturn = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

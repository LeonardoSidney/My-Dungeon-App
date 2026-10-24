import { Adventure } from '@domain/entities';

export interface IDeleteChatAdventureService {
  deleteChat (params: DeleteChatAdventureServiceParams): DeleteChatAdventureServiceReturn;
}

export type DeleteChatAdventureServiceParams = {
  adventure: Adventure;
  chatId: string;
};

export type DeleteChatAdventureServiceReturn = {
  success: boolean;
  adventure?: Adventure;
  error?: string;
};

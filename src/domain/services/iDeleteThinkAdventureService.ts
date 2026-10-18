import { Adventure, Chat } from '@domain/entities';

export interface IDeleteThinkAdventureService {
  deleteThink (params: DeleteThinkAdventureServiceParams): DeleteThinkAdventureServiceReturn;
}

export type DeleteThinkAdventureServiceParams = {
  adventure: Adventure;
  chatId: string;
  index: number;
};

export type DeleteThinkAdventureServiceReturn = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

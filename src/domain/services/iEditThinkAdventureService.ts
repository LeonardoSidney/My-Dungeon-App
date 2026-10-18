import { Adventure, Chat } from '@domain/entities';

export interface IEditThinkAdventureService {
  editThink (params: EditThinkAdventureServiceParams): EditThinkAdventureServiceReturn;
}

export type EditThinkAdventureServiceParams = {
  adventure: Adventure;
  chatId: string;
  content: string;
};

export type EditThinkAdventureServiceReturn = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

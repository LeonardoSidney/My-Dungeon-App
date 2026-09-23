import { Adventure, Chat, Role } from '@domain/entities';

export interface IEditChatAdventureService {
  editChat (params: EditChatAdventureServiceParams): EditChatAdventureServiceReturn;
}

export type EditChatAdventureServiceParams = {
  adventure: Adventure;
  chatId: string;
  content: string;
  role: Role;
  characterId: string;
};

export type EditChatAdventureServiceReturn = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

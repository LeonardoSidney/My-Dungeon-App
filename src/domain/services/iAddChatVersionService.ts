import { Adventure, Chat, Role } from '@domain/entities';

export interface IAddChatVersionService {
  addVersion (params: AddChatVersionServiceParams): AddChatVersionServiceReturn;
}

export type AddChatVersionServiceParams = {
  adventure: Adventure;
  chatId: string;
  content: string;
  role: Role;
  characterId: string;
};

export type AddChatVersionServiceReturn = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

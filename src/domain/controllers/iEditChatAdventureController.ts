import { Adventure, Chat, Role } from '@domain/entities';

export interface IEditChatAdventureController {
  handle (request: EditChatControllerRequest): Promise<EditChatControllerResponse>;
}

export type EditChatControllerRequest = {
  adventure: Adventure;
  chatId: string;
  content: string;
  role: Role;
  characterId: string;
};

export type EditChatControllerResponse = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

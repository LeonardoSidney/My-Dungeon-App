import { Adventure, Chat, Role } from '../entities';

export interface IEditChatAdventureUseCase {
  execute (params: EditChatAdventureUseCaseParams): Promise<EditChatAdventureUseCaseReturn>;
}

export type EditChatAdventureUseCaseParams = {
  adventure: Adventure;
  chatId: string;
  content: string;
  role: Role;
  characterId: string;
};

export type EditChatAdventureUseCaseReturn = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

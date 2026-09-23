import { Adventure, Chat } from '@domain/entities';

export interface IDeleteChatAdventureUseCase {
  execute (params: DeleteChatAdventureUseCaseParams): Promise<DeleteChatAdventureUseCaseReturn>;
}

export type DeleteChatAdventureUseCaseParams = {
  adventure: Adventure;
  chatId: string;
  index: number;
};

export type DeleteChatAdventureUseCaseReturn = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

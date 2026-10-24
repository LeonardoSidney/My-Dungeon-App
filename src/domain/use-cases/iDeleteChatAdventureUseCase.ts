import { Adventure } from '@domain/entities';

export interface IDeleteChatAdventureUseCase {
  execute (params: DeleteChatAdventureUseCaseParams): Promise<DeleteChatAdventureUseCaseReturn>;
}

export type DeleteChatAdventureUseCaseParams = {
  adventureId: string;
  chatId: string;
};

export type DeleteChatAdventureUseCaseReturn = {
  success: boolean;
  adventure?: Adventure;
  error?: string;
};

import { Adventure, Chat } from '../entities';

export interface IDeleteThinkAdventureUseCase {
  execute (params: DeleteThinkAdventureUseCaseParams): Promise<DeleteThinkAdventureUseCaseReturn>;
}

export type DeleteThinkAdventureUseCaseParams = {
  adventure: Adventure;
  chatId: string;
  index: number;
};

export type DeleteThinkAdventureUseCaseReturn = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

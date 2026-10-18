import { Adventure, Chat } from '../entities';

export interface IEditThinkAdventureUseCase {
  execute (params: EditThinkAdventureUseCaseParams): Promise<EditThinkAdventureUseCaseReturn>;
}

export type EditThinkAdventureUseCaseParams = {
  adventure: Adventure;
  chatId: string;
  content: string;
};

export type EditThinkAdventureUseCaseReturn = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

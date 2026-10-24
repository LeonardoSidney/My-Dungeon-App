import { Adventure } from '@domain/entities';

export interface IDeleteChatVersionUseCase {
  execute (params: DeleteChatVersionUseCaseParams): Promise<DeleteChatVersionUseCaseReturn>;
}

export type DeleteChatVersionUseCaseParams = {
  adventureId: string;
  chatId: string;
  versionIndex: number;
};

export type DeleteChatVersionUseCaseReturn = {
  success: boolean;
  adventure?: Adventure;
  error?: string;
};

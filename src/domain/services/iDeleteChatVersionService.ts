import { Adventure } from '@domain/entities';

export interface IDeleteChatVersionService {
  deleteVersion (params: DeleteChatVersionServiceParams): DeleteChatVersionServiceReturn;
}

export type DeleteChatVersionServiceParams = {
  adventure: Adventure;
  chatId: string;
  versionIndex: number;
};

export type DeleteChatVersionServiceReturn = {
  success: boolean;
  adventure?: Adventure;
  error?: string;
};

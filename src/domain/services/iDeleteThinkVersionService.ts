import { Adventure } from '@domain/entities';

export interface IDeleteThinkVersionService {
  deleteThink (params: DeleteThinkVersionServiceParams): DeleteThinkVersionServiceReturn;
}

export type DeleteThinkVersionServiceParams = {
  adventure: Adventure;
  chatId: string;
  versionIndex: number;
};

export type DeleteThinkVersionServiceReturn = {
  success: boolean;
  adventure?: Adventure;
  error?: string;
};

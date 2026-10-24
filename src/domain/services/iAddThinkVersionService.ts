import { Adventure, Chat } from '@domain/entities';

export interface IAddThinkVersionService {
  addVersion (params: AddThinkVersionServiceParams): AddThinkVersionServiceReturn;
}

export type AddThinkVersionServiceParams = {
  adventure: Adventure;
  chatId: string;
  content: string;
};

export type AddThinkVersionServiceReturn = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

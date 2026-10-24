import { Adventure, Chat } from '@domain/entities';

export type ChatVersionKind = 'content' | 'think';

export interface ISelectChatVersionService {
  selectVersion (params: SelectChatVersionServiceParams): SelectChatVersionServiceReturn;
}

export type SelectChatVersionServiceParams = {
  adventure: Adventure;
  chatId: string;
  index: number;
  kind: ChatVersionKind;
};

export type SelectChatVersionServiceReturn = {
  success: boolean;
  chat?: Chat;
  adventure?: Adventure;
  error?: string;
};

import { ChatVersionKind } from '../services';

export interface ISelectChatVersionUseCase {
  execute (params: SelectChatVersionUseCaseParams): Promise<SelectChatVersionUseCaseReturn>;
}

export type SelectChatVersionUseCaseParams = {
  adventureId: string;
  chatId: string;
  direction: -1 | 1;
  kind: ChatVersionKind;
};

export type SelectChatVersionUseCaseReturn = {
  success: boolean;
  error?: string;
};

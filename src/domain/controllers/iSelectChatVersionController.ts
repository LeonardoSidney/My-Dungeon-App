import { ChatVersionKind } from '@domain/services';

export interface ISelectChatVersionController {
  handle (params: SelectChatVersionControllerParams): Promise<SelectChatVersionControllerResponse>;
}

export type SelectChatVersionControllerParams = {
  adventureId: string;
  chatId: string;
  direction: -1 | 1;
  kind: ChatVersionKind;
};

export type SelectChatVersionControllerResponse = {
  success: boolean;
  error?: string;
};
export type { ChatVersionKind } from '@domain/services';

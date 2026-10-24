export interface IAddChatVersionController {
  handle (request: AddChatVersionControllerRequest): Promise<AddChatVersionControllerResponse>;
}

export type AddChatVersionControllerRequest = {
  adventureId: string;
  chatId: string;
  content: string;
};

export type AddChatVersionControllerResponse = {
  success: boolean;
  error?: string;
};

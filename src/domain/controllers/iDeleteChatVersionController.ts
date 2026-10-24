export interface IDeleteChatVersionController {
  handle (request: DeleteChatVersionControllerRequest): Promise<DeleteChatVersionControllerResponse>;
}

export type DeleteChatVersionControllerRequest = {
  adventureId: string;
  chatId: string;
  versionIndex: number;
};

export type DeleteChatVersionControllerResponse = {
  success: boolean;
  error?: string;
};

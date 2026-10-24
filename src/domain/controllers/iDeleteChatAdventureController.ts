export interface IDeleteChatAdventureController {
  handle (request: DeleteChatControllerRequest): Promise<DeleteChatControllerResponse>;
}

export type DeleteChatControllerRequest = {
  adventureId: string;
  chatId: string;
};

export type DeleteChatControllerResponse = {
  success: boolean;
  error?: string;
};

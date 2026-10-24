export interface IDeleteThinkVersionController {
  handle (request: DeleteThinkControllerRequest): Promise<DeleteThinkControllerResponse>;
}

export type DeleteThinkControllerRequest = {
  adventureId: string;
  chatId: string;
  versionIndex: number;
};

export type DeleteThinkControllerResponse = {
  success: boolean;
  error?: string;
};

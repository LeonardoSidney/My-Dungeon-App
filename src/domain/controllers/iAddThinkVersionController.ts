export interface IAddThinkVersionController {
  handle (request: AddThinkVersionControllerRequest): Promise<AddThinkVersionControllerResponse>;
}

export type AddThinkVersionControllerRequest = {
  adventureId: string;
  chatId: string;
  content: string;
};

export type AddThinkVersionControllerResponse = {
  success: boolean;
  error?: string;
};

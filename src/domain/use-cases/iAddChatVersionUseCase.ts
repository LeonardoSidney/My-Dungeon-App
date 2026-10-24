export interface IAddChatVersionUseCase {
  execute (params: AddChatVersionUseCaseParams): Promise<AddChatVersionUseCaseReturn>;
}

export type AddChatVersionUseCaseParams = {
  adventureId: string;
  chatId: string;
  content: string;
};

export type AddChatVersionUseCaseReturn = {
  success: boolean;
  error?: string;
};

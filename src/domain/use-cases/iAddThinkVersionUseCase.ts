export interface IAddThinkVersionUseCase {
  execute (params: AddThinkVersionUseCaseParams): Promise<AddThinkVersionUseCaseReturn>;
}

export type AddThinkVersionUseCaseParams = {
  adventureId: string;
  chatId: string;
  content: string;
};

export type AddThinkVersionUseCaseReturn = {
  success: boolean;
  error?: string;
};

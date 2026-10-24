export interface IDeleteThinkVersionUseCase {
  execute (params: DeleteThinkVersionUseCaseParams): Promise<DeleteThinkVersionUseCaseReturn>;
}

export type DeleteThinkVersionUseCaseParams = {
  adventureId: string;
  chatId: string;
  versionIndex: number;
};

export type DeleteThinkVersionUseCaseReturn = {
  success: boolean;
  error?: string;
};

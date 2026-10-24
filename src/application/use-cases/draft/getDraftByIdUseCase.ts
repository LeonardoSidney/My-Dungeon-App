import { ILogger } from '@domain/logger';
import { IDraftRepository } from '@domain/repository';
import { GetDraftByIdUseCaseParams, GetDraftByIdUseCaseReturn, IGetDraftByIdUseCase } from '@domain/use-cases';

export class GetDraftByIdUseCase implements IGetDraftByIdUseCase {
    constructor (
        private readonly logger: ILogger,
        private readonly draftRepository: IDraftRepository
    ) { }

    async execute (params: GetDraftByIdUseCaseParams): Promise<GetDraftByIdUseCaseReturn> {
        this.logger.info('Executing GetDraftByIdUseCase::execute');

        const validationError = this.validate(params);
        if (validationError) {
            return { success: false, error: validationError };
        }

        const response = await this.draftRepository.getDraftById(params.draftId);
        if (!response.success) {
            this.logger.warning('GetDraftByIdUseCase::execute - failed to load draft', response.error);
            return { success: false, error: response.error };
        }

        return { success: true, draft: response.draft };
    }

    private validate (params: GetDraftByIdUseCaseParams): string | null {
        if (!params.draftId?.trim()) {
            return 'Draft id is required';
        }

        return null;
    }
}

import { Adventure } from '@domain/entities';

export interface IIsAdventureStreamingUseCase {
    execute(params: IsAdventureStreamingUseCaseParams): Promise<IsAdventureStreamingUseCaseReturn>;
}

export type IsAdventureStreamingUseCaseParams = {
    adventure: Adventure;
};

export type IsAdventureStreamingUseCaseReturn = {
    success: boolean;
    isStreaming: boolean;
};

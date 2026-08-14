import { Adventure } from '@domain/entities';

export interface IIsAdventureStreamingService {
    isAdventureStreaming(params: IsAdventureStreamingServiceParams): IsAdventureStreamingServiceReturn;
}

export type IsAdventureStreamingServiceParams = {
    adventure: Adventure;
};

export type IsAdventureStreamingServiceReturn = {
    success: boolean;
    isStreaming: boolean;
};

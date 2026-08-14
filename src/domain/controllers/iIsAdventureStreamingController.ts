import { Adventure } from '@domain/entities';

export interface IIsAdventureStreamingController {
    handle(request: IsAdventureStreamingControllerRequest): Promise<IsAdventureStreamingControllerResponse>;
}

export type IsAdventureStreamingControllerRequest = {
    adventure: Adventure;
};

export type IsAdventureStreamingControllerResponse = {
    success: boolean;
    isStreaming: boolean;
};

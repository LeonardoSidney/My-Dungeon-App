import type { IKeyedEventChannel } from './iKeyedEventChannel';

export enum DraftStatusEnum {
    STREAMING = 'streaming',
    IDLE = 'idle'
}

export type DraftStatus = DraftStatusEnum.STREAMING | DraftStatusEnum.IDLE;

export type DraftEvent = {
    draftId: string;
    status: DraftStatus;
    error?: string;
};

export type IDraftChannel = IKeyedEventChannel<DraftEvent>;

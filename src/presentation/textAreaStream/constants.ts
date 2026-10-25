import React from 'react';
import {
    DraftUpdateView,
    IAlertController,
    IGetDraftController,
    ISaveDraftController,
    IStartDraftCompletionController,
    IStopDraftCompletionController,
    ISubscribeDraftController,
} from '@domain/controllers';

export interface TextAreaStreamProps {
    prompt: string;
    setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

export interface UseDraftParams {
    draftId: string;
    getDraft: IGetDraftController;
    subscribeDraft: ISubscribeDraftController;
    setPrompt: (content: string) => void;
    alert: IAlertController;
}

export interface HandleDraftUpdateParams {
    update: DraftUpdateView;
    reloadDraft: () => Promise<void>;
    setIsStreaming: (isStreaming: boolean) => void;
    alert: IAlertController;
}

export interface ToggleDraftCompletionParams {
    draftId: string;
    prompt: string;
    isStreaming: boolean;
    startDraftCompletion: IStartDraftCompletionController;
    stopDraftCompletion: IStopDraftCompletionController;
    alert: IAlertController;
}

export interface SaveDraftEditParams {
    draftId: string;
    content: string;
    saveDraft: ISaveDraftController;
    alert: IAlertController;
}

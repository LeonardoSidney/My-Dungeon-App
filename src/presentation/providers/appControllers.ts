import {
    ICreateAbilityController,
    IGetAbilitiesController,
    IGetAbilityController,
    IEditAbilityController,
    IEraseAbilityController,
    ICreateAdventureController,
    IEditAdventureController,
    IApplyAdventureSettingsController,
    IGetAdventuresController,
    IGetAdventureController,
    IEraseAdventuresController,
    IEraseAdventureController,
    IGetAdventureSystemPromptController,
    IGetAdventureTemplatedPromptController,
    IGetAdventureCharactersController,
    IGetAdventureWorldMasterController,
    IGetAdventureSummaryController,
    IGetChatMessagesController,
    IGetChatMessageController,
    IStopChatReplyController,
    ISubscribeChatReplyController,
    IRecoverInterruptedRepliesController,
    IAppendChatAdventureController,
    IAddChatVersionController,
    IDeleteChatAdventureController,
    IDeleteChatVersionController,
    IAddThinkVersionController,
    IDeleteThinkVersionController,
    IContinueFromChatController,
    IRegenerateFromChatController,
    IResendChatController,
    IGenerateChatReplyController,
    ISelectChatVersionController,
    ISetAdventureWorldMasterController,
    ICreateAssistantController,
    IGetAssistantsController,
    IGetAssistantController,
    IEditAssistantController,
    IEraseAssistantController,
    ICreateCharacterController,
    IGetCharactersController,
    IGetCharacterController,
    IEditCharacterController,
    IEraseCharacterController,
    ICreateConnectionConfigController,
    IGetConnectionsController,
    IGetConnectionController,
    IEditConnectionController,
    IEraseConnectionController,
    ICreateItemController,
    IGetItemsController,
    IGetItemController,
    IEditItemController,
    IEraseItemController,
    ICreateLocationController,
    IGetLocationsController,
    IGetLocationController,
    IEditLocationController,
    IEraseLocationController,
    IGetModelsController,
    ICreateProficiencyController,
    IGetProficienciesController,
    IGetProficiencyController,
    IEditProficiencyController,
    IEraseProficiencyController,
    ICreateSamplerController,
    IGetSamplersController,
    IGetSamplerController,
    IEditSamplerController,
    IEraseSamplerController,
    ICreateStatusController,
    IGetStatusesController,
    IGetStatusController,
    IEditStatusController,
    IEraseStatusController,
    IGetDraftController,
    ISaveDraftController,
    IStartDraftCompletionController,
    IStopDraftCompletionController,
    ISubscribeDraftController,
    ICreateSystemPromptController,
    IGetSystemPromptsController,
    IGetSystemPromptController,
    IEditSystemPromptController,
    IEraseSystemPromptController,
    ICreateWorldController,
    IGetWorldsController,
    IGetWorldController,
    IEraseWorldController,
    IEditWorldController,
    ICreateWorldMasterController,
    IGetWorldMastersController,
    IGetWorldMasterController,
    IEditWorldMasterController,
    IEraseWorldMasterController,
    IAlertController,
    IGetHomeSummaryController,
    IGetSystemPromptLoadOrderController,
    ISaveSystemPromptLoadOrderController,
    IResetSystemPromptLoadOrderController,
} from '@domain/controllers';

export type AppControllers = {
    createAbility: ICreateAbilityController;
    getAbilities: IGetAbilitiesController;
    getAbility: IGetAbilityController;
    editAbility: IEditAbilityController;
    eraseAbility: IEraseAbilityController;
    createAdventure: ICreateAdventureController;
    editAdventure: IEditAdventureController;
    applyAdventureSettings: IApplyAdventureSettingsController;
    getAdventures: IGetAdventuresController;
    getAdventure: IGetAdventureController;
    eraseAdventures: IEraseAdventuresController;
    eraseAdventure: IEraseAdventureController;
    getAdventureSystemPrompt: IGetAdventureSystemPromptController;
    getAdventureTemplatedPrompt: IGetAdventureTemplatedPromptController;
    getAdventureCharacters: IGetAdventureCharactersController;
    getAdventureWorldMaster: IGetAdventureWorldMasterController;
    getAdventureSummary: IGetAdventureSummaryController;
    getChatMessages: IGetChatMessagesController;
    getChatMessage: IGetChatMessageController;
    stopChatReply: IStopChatReplyController;
    subscribeChatReply: ISubscribeChatReplyController;
    recoverInterruptedReplies: IRecoverInterruptedRepliesController;
    appendChatAdventure: IAppendChatAdventureController;
    addChatVersion: IAddChatVersionController;
    deleteChatAdventure: IDeleteChatAdventureController;
    deleteChatVersion: IDeleteChatVersionController;
    addThinkVersion: IAddThinkVersionController;
    deleteThinkVersion: IDeleteThinkVersionController;
    continueFromChat: IContinueFromChatController;
    regenerateFromChat: IRegenerateFromChatController;
    resendChat: IResendChatController;
    generateChatReply: IGenerateChatReplyController;
    selectChatVersion: ISelectChatVersionController;
    setAdventureWorldMaster: ISetAdventureWorldMasterController;
    createAssistant: ICreateAssistantController;
    getAssistants: IGetAssistantsController;
    getAssistant: IGetAssistantController;
    editAssistant: IEditAssistantController;
    eraseAssistant: IEraseAssistantController;
    createCharacter: ICreateCharacterController;
    getCharacters: IGetCharactersController;
    getCharacter: IGetCharacterController;
    editCharacter: IEditCharacterController;
    eraseCharacter: IEraseCharacterController;
    createConnectionConfig: ICreateConnectionConfigController;
    getConnections: IGetConnectionsController;
    getConnection: IGetConnectionController;
    editConnection: IEditConnectionController;
    eraseConnection: IEraseConnectionController;
    createItem: ICreateItemController;
    getItems: IGetItemsController;
    getItem: IGetItemController;
    editItem: IEditItemController;
    eraseItem: IEraseItemController;
    createLocation: ICreateLocationController;
    getLocations: IGetLocationsController;
    getLocation: IGetLocationController;
    editLocation: IEditLocationController;
    eraseLocation: IEraseLocationController;
    getModels: IGetModelsController;
    createProficiency: ICreateProficiencyController;
    getProficiencies: IGetProficienciesController;
    getProficiency: IGetProficiencyController;
    editProficiency: IEditProficiencyController;
    eraseProficiency: IEraseProficiencyController;
    createSampler: ICreateSamplerController;
    getSamplers: IGetSamplersController;
    getSampler: IGetSamplerController;
    editSampler: IEditSamplerController;
    eraseSampler: IEraseSamplerController;
    createStatus: ICreateStatusController;
    getStatuses: IGetStatusesController;
    getStatus: IGetStatusController;
    editStatus: IEditStatusController;
    eraseStatus: IEraseStatusController;
    getDraft: IGetDraftController;
    saveDraft: ISaveDraftController;
    startDraftCompletion: IStartDraftCompletionController;
    stopDraftCompletion: IStopDraftCompletionController;
    subscribeDraft: ISubscribeDraftController;
    createSystemPrompt: ICreateSystemPromptController;
    getSystemPrompts: IGetSystemPromptsController;
    getSystemPrompt: IGetSystemPromptController;
    editSystemPrompt: IEditSystemPromptController;
    eraseSystemPrompt: IEraseSystemPromptController;
    createWorld: ICreateWorldController;
    getWorlds: IGetWorldsController;
    getWorld: IGetWorldController;
    eraseWorld: IEraseWorldController;
    editWorld: IEditWorldController;
    createWorldMaster: ICreateWorldMasterController;
    getWorldMasters: IGetWorldMastersController;
    getWorldMaster: IGetWorldMasterController;
    editWorldMaster: IEditWorldMasterController;
    eraseWorldMaster: IEraseWorldMasterController;
    alert: IAlertController;
    getHomeSummary: IGetHomeSummaryController;
    getSystemPromptLoadOrder: IGetSystemPromptLoadOrderController;
    saveSystemPromptLoadOrder: ISaveSystemPromptLoadOrderController;
    resetSystemPromptLoadOrder: IResetSystemPromptLoadOrderController;
};

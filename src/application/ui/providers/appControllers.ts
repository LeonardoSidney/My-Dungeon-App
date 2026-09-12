import {
    ICreateAbilityController,
    IGetAbilitiesController,
    IEditAbilityController,
    IEraseAbilityController,
    ICreateAdventureController,
    IEditAdventureController,
    IGetAdventuresController,
    IAppendChatAdventureController,
    ICreateChatAdventureController,
    IEraseAdventuresController,
    IEraseAdventureController,
    IGetAdventureTextController,
    IGetAdventureSystemPromptController,
    IHydrateAdventureController,
    IStartStreamingChatController,
    IUpdateStreamingChatController,
    IFinishStreamingChatController,
    IIsAdventureStreamingController,
    ICreateAssistantController,
    IGetAssistantsController,
    IEditAssistantController,
    IEraseAssistantController,
    ICreateCharacterController,
    IGetCharactersController,
    IEditCharacterController,
    IEraseCharacterController,
    ICreateConnectionConfigController,
    IGetConnectionsController,
    IEraseConnectionController,
    IEditConnectionController,
    ICreateItemController,
    IGetItemsController,
    IEditItemController,
    IEraseItemController,
    ICreateLocationController,
    IGetLocationsController,
    IEditLocationController,
    IEraseLocationController,
    ICreateProficiencyController,
    IGetProficienciesController,
    IEditProficiencyController,
    IEraseProficiencyController,
    ICreateSamplerController,
    IGetSamplersController,
    IEditSamplerController,
    IEraseSamplerController,
    ICreateStatusController,
    IGetStatusesController,
    IEditStatusController,
    IEraseStatusController,
    IStreamCompletionController,
    INativeStreamCompletionController,
    ICreateSystemPromptController,
    IGetSystemPromptsController,
    IEditSystemPromptController,
    IEraseSystemPromptController,
    ICreateWorldController,
    IGetWorldsController,
    IEraseWorldController,
    IEditWorldController,
    ICreateWorldMasterController,
    IGetWorldMastersController,
    IEditWorldMasterController,
    IEraseWorldMasterController,
    IGetModelsFromProviderController,
} from '@domain/controllers';

export type AppControllers = {
    createAbility: ICreateAbilityController;
    getAbilities: IGetAbilitiesController;
    editAbility: IEditAbilityController;
    eraseAbility: IEraseAbilityController;
    createAdventure: ICreateAdventureController;
    editAdventure: IEditAdventureController;
    getAdventures: IGetAdventuresController;
    appendChatAdventure: IAppendChatAdventureController;
    createChatAdventure: ICreateChatAdventureController;
    eraseAdventures: IEraseAdventuresController;
    eraseAdventure: IEraseAdventureController;
    getAdventureText: IGetAdventureTextController;
    getAdventureSystemPrompt: IGetAdventureSystemPromptController;
    hydrateAdventure: IHydrateAdventureController;
    startStreamingChat: IStartStreamingChatController;
    updateStreamingChat: IUpdateStreamingChatController;
    finishStreamingChat: IFinishStreamingChatController;
    isAdventureStreaming: IIsAdventureStreamingController;
    createAssistant: ICreateAssistantController;
    getAssistants: IGetAssistantsController;
    editAssistant: IEditAssistantController;
    eraseAssistant: IEraseAssistantController;
    createCharacter: ICreateCharacterController;
    getCharacters: IGetCharactersController;
    editCharacter: IEditCharacterController;
    eraseCharacter: IEraseCharacterController;
    createConnectionConfig: ICreateConnectionConfigController;
    getConnections: IGetConnectionsController;
    eraseConnection: IEraseConnectionController;
    editConnection: IEditConnectionController;
    createItem: ICreateItemController;
    getItems: IGetItemsController;
    editItem: IEditItemController;
    eraseItem: IEraseItemController;
    createLocation: ICreateLocationController;
    getLocations: IGetLocationsController;
    editLocation: IEditLocationController;
    eraseLocation: IEraseLocationController;
    getModelsFromProvider: IGetModelsFromProviderController;
    createProficiency: ICreateProficiencyController;
    getProficiencies: IGetProficienciesController;
    editProficiency: IEditProficiencyController;
    eraseProficiency: IEraseProficiencyController;
    createSampler: ICreateSamplerController;
    getSamplers: IGetSamplersController;
    editSampler: IEditSamplerController;
    eraseSampler: IEraseSamplerController;
    createStatus: ICreateStatusController;
    getStatuses: IGetStatusesController;
    editStatus: IEditStatusController;
    eraseStatus: IEraseStatusController;
    getStreamCompletion: IStreamCompletionController;
    getNativeStreamCompletion: INativeStreamCompletionController;
    createSystemPrompt: ICreateSystemPromptController;
    getSystemPrompts: IGetSystemPromptsController;
    editSystemPrompt: IEditSystemPromptController;
    eraseSystemPrompt: IEraseSystemPromptController;
    createWorld: ICreateWorldController;
    getWorlds: IGetWorldsController;
    eraseWorld: IEraseWorldController;
    editWorld: IEditWorldController;
    createWorldMaster: ICreateWorldMasterController;
    getWorldMasters: IGetWorldMastersController;
    editWorldMaster: IEditWorldMasterController;
    eraseWorldMaster: IEraseWorldMasterController;
};

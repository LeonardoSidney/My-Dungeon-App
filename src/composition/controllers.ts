import {
    createAbilityController,
    getAbilitiesController,
    editAbilityController,
    eraseAbilityController,
    createAdventureController,
    editAdventureController,
    getAdventuresController,
    appendChatAdventureController,
    createChatAdventureController,
    eraseAdventuresController,
    eraseAdventureController,
    getAdventureTextController,
    hydrateAdventureController,
    startStreamingChatController,
    updateStreamingChatController,
    finishStreamingChatController,
    isAdventureStreamingController,
    createAssistantController,
    getAssistantsController,
    editAssistantController,
    eraseAssistantController,
    createCharacterController,
    getCharactersController,
    editCharacterController,
    eraseCharacterController,
    createConnectionConfigController,
    getConnectionsController,
    eraseConnectionController,
    editConnectionController,
    createItemController,
    getItemsController,
    editItemController,
    eraseItemController,
    createLocationController,
    getLocationsController,
    editLocationController,
    eraseLocationController,
    getModelsFromProviderController,
    createProficiencyController,
    getProficienciesController,
    editProficiencyController,
    eraseProficiencyController,
    createSamplerController,
    getSamplersController,
    editSamplerController,
    eraseSamplerController,
    createStatusController,
    getStatusesController,
    editStatusController,
    eraseStatusController,
    getStreamCompletionController,
    createSystemPromptController,
    getSystemPromptsController,
    editSystemPromptController,
    eraseSystemPromptController,
    createWorldController,
    getWorldsController,
    eraseWorldController,
    editWorldController,
    createWorldMasterController,
    getWorldMasterController,
    editWorldMasterController,
    eraseWorldMasterController,
} from '@infra/container';
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
    IGetModelsFromProviderController,
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

export function buildControllers (): AppControllers {
    return {

        createAbility: createAbilityController(),
        getAbilities: getAbilitiesController(),
        editAbility: editAbilityController(),
        eraseAbility: eraseAbilityController(),
        createAdventure: createAdventureController(),
        editAdventure: editAdventureController(),
        getAdventures: getAdventuresController(),
        appendChatAdventure: appendChatAdventureController(),
        createChatAdventure: createChatAdventureController(),
        eraseAdventures: eraseAdventuresController(),
        eraseAdventure: eraseAdventureController(),
        getAdventureText: getAdventureTextController(),
        hydrateAdventure: hydrateAdventureController(),
        startStreamingChat: startStreamingChatController(),
        updateStreamingChat: updateStreamingChatController(),
        finishStreamingChat: finishStreamingChatController(),
        isAdventureStreaming: isAdventureStreamingController(),
        createAssistant: createAssistantController(),
        getAssistants: getAssistantsController(),
        editAssistant: editAssistantController(),
        eraseAssistant: eraseAssistantController(),
        createCharacter: createCharacterController(),
        getCharacters: getCharactersController(),
        editCharacter: editCharacterController(),
        eraseCharacter: eraseCharacterController(),
        createConnectionConfig: createConnectionConfigController(),
        getConnections: getConnectionsController(),
        eraseConnection: eraseConnectionController(),
        editConnection: editConnectionController(),
        createItem: createItemController(),
        getItems: getItemsController(),
        editItem: editItemController(),
        eraseItem: eraseItemController(),
        createLocation: createLocationController(),
        getLocations: getLocationsController(),
        editLocation: editLocationController(),
        eraseLocation: eraseLocationController(),
        getModelsFromProvider: getModelsFromProviderController(),
        createProficiency: createProficiencyController(),
        getProficiencies: getProficienciesController(),
        editProficiency: editProficiencyController(),
        eraseProficiency: eraseProficiencyController(),
        createSampler: createSamplerController(),
        getSamplers: getSamplersController(),
        editSampler: editSamplerController(),
        eraseSampler: eraseSamplerController(),
        createStatus: createStatusController(),
        getStatuses: getStatusesController(),
        editStatus: editStatusController(),
        eraseStatus: eraseStatusController(),
        getStreamCompletion: getStreamCompletionController(),
        createSystemPrompt: createSystemPromptController(),
        getSystemPrompts: getSystemPromptsController(),
        editSystemPrompt: editSystemPromptController(),
        eraseSystemPrompt: eraseSystemPromptController(),
        createWorld: createWorldController(),
        getWorlds: getWorldsController(),
        eraseWorld: eraseWorldController(),
        editWorld: editWorldController(),
        createWorldMaster: createWorldMasterController(),
        getWorldMasters: getWorldMasterController(),
        editWorldMaster: editWorldMasterController(),
        eraseWorldMaster: eraseWorldMasterController(),
    };
}

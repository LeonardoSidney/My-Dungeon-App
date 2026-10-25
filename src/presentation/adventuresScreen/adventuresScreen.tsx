import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { MessageSquare, Scroll, Pencil, Trash2 } from 'lucide-react-native';
import { AdventureDetails, AdventureListItem } from '@domain/controllers';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { styles } from './styles';
import { CrudEntityList, IconButton } from '@presentation/components';
import { AdventureChatScreen } from './adventureChatScreen';
import { SystemPromptViewer } from './systemPromptViewer';
import { AdventuresForm } from './adventuresForm';
import { useEntityScreen } from '@presentation/hooks';
import { AdventureFormData, AdventuresScreenProps, AdventureChatScreenControllers } from './constants';
import { initialAdventureForm, submitAdventure, toAdventureFormState, validateAdventureForm } from './form';
import { useAdventureFormOptions } from './useAdventureFormOptions';

export function AdventuresScreen ({ onChatVisibleChange }: AdventuresScreenProps) {
  const controllers = useControllers();
  const { createAdventure, editAdventure, eraseAdventure, getAdventures, getAdventure } = controllers;
  const formOptions = useAdventureFormOptions(controllers);
  const [showChat, setShowChat] = useState(false);
  const [selectedAdventureId, setSelectedAdventureId] = useState<string | null>(null);
  const [systemPromptAdventureId, setSystemPromptAdventureId] = useState<string | null>(null);

  const isChatVisible = showChat && selectedAdventureId !== null;

  useEffect(() => {
    onChatVisibleChange?.(isChatVisible);
  }, [isChatVisible, onChatVisibleChange]);

  useEffect(() => () => onChatVisibleChange?.(false), [onChatVisibleChange]);

  const {
    entities,
    isLoading,
    isError,
    form,
    updateField,
    showForm,
    openAdd,
    openEdit,
    closeForm,
    formErrors,
    save,
    eraseEntity,
    reload,
  } = useEntityScreen<AdventureListItem, AdventureFormData, AdventureDetails>({
    fetch: () => getAdventures.handle(),
    load: (id) => getAdventure.handle({ id }),
    submit: (adventureForm) => submitAdventure(adventureForm, createAdventure, editAdventure),
    erase: (id) => eraseAdventure.handle({ id }),
    toFormState: (adventure) => toAdventureFormState(adventure, { characters: formOptions.characters.items, systemPrompts: formOptions.systemPrompts.items, worldMasters: formOptions.worldMasters.items, worlds: formOptions.worlds.items, locations: formOptions.locations.items, items: formOptions.items.items }),
    initialForm: initialAdventureForm,
    validate: validateAdventureForm,
    entityName: 'adventure',
    alert: controllers.alert,
  });

  const handleChat = (adventure: AdventureListItem) => {
    setSelectedAdventureId(adventure.id);
    setShowChat(true);
  };

  const handleViewSystemPrompt = (adventure: AdventureListItem) => {
    setSystemPromptAdventureId(adventure.id);
  };

  const handleBackFromSystemPromptViewer = () => {
    setSystemPromptAdventureId(null);
  };

  const chatScreenControllers: AdventureChatScreenControllers = {
    getAdventureSummary: controllers.getAdventureSummary,
    getAdventureCharacters: controllers.getAdventureCharacters,
    getAdventureWorldMaster: controllers.getAdventureWorldMaster,
    getChatMessages: controllers.getChatMessages,
    getChatMessage: controllers.getChatMessage,
    stopChatReply: controllers.stopChatReply,
    subscribeChatReply: controllers.subscribeChatReply,
    appendChatAdventure: controllers.appendChatAdventure,
    addChatVersion: controllers.addChatVersion,
    deleteChatAdventure: controllers.deleteChatAdventure,
    deleteChatVersion: controllers.deleteChatVersion,
    addThinkVersion: controllers.addThinkVersion,
    deleteThinkVersion: controllers.deleteThinkVersion,
    continueFromChat: controllers.continueFromChat,
    regenerateFromChat: controllers.regenerateFromChat,
    resendChat: controllers.resendChat,
    generateChatReply: controllers.generateChatReply,
    selectChatVersion: controllers.selectChatVersion,
    getWorldMasters: controllers.getWorldMasters,
    setAdventureWorldMaster: controllers.setAdventureWorldMaster,
    alert: controllers.alert,
  };

  const handleBackFromChat = () => {
    setShowChat(false);
    setSelectedAdventureId(null);
    reload();
  };

  const renderActions = (adventure: AdventureListItem) => (
    <>
      <IconButton icon={MessageSquare} accessibilityLabel="Open chat" onPress={() => handleChat(adventure)} />
      <IconButton icon={Scroll} accessibilityLabel="View prompt" onPress={() => handleViewSystemPrompt(adventure)} />
      <IconButton icon={Pencil} accessibilityLabel="Edit" onPress={() => openEdit(adventure)} />
      <IconButton icon={Trash2} accessibilityLabel="Delete" onPress={() => eraseEntity(adventure)} />
    </>
  );

  const formElement = showForm && (
    <AdventuresForm
      showForm={showForm}
      adventureStateFormData={form}
      onChange={updateField}
      onCancel={closeForm}
      onSave={save}
      formErrors={formErrors}
      characters={formOptions.characters.items}
      systemPrompts={formOptions.systemPrompts.items}
      worldMasters={formOptions.worldMasters.items}
      worlds={formOptions.worlds.items}
      locations={formOptions.locations.items}
      items={formOptions.items.items}
      optionErrors={formOptions.optionErrors}
    />
  );

  return (
    <View style={styles.container}>
      <CrudEntityList
        items={entities}
        isLoading={isLoading}
        isError={isError}
        errorMessage="Failed to load adventures."
        emptyText="No adventures found."
        addLabel="Add Adventure"
        onAdd={openAdd}
        onEdit={openEdit}
        onDelete={eraseEntity}
        getDetailText={(adventure) => `Created: ${new Date(adventure.createdAt).toLocaleDateString()}`}
        renderActions={renderActions}
        form={formElement}
      />

      {showChat && selectedAdventureId && (
        <View style={styles.chatOverlay}>
          <AdventureChatScreen
            adventureId={selectedAdventureId}
            onBack={handleBackFromChat}
            controllers={chatScreenControllers}
          />
        </View>
      )}

      {systemPromptAdventureId && (
        <View style={styles.chatOverlay}>
          <SystemPromptViewer adventureId={systemPromptAdventureId} onBack={handleBackFromSystemPromptViewer} controllers={controllers} />
        </View>
      )}
    </View>
  );
}

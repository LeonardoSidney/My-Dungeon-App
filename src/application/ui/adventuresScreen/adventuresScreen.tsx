import React, { useEffect, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { MessageSquare, Scroll, Pencil, Trash2 } from 'lucide-react-native';
import { Adventure } from '@domain/entities';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { styles } from './styles';
import { colors } from '../theme';
import { CrudEntityList, screenStyles } from '@application/ui/components';
import { AdventureChatScreen } from './adventureChatScreen';
import { SystemPromptViewer } from './systemPromptViewer';
import { onViewSystemPrompt, SystemPromptViewData } from './onViewSystemPrompt';
import { AdventuresForm } from './adventuresForm';
import { useEntityScreen } from '@application/ui/hooks';
import { AdventuresScreenProps, AdventureChatScreenControllers } from './constants';
import { initialAdventureForm, submitAdventure, toAdventureFormState, validateAdventureForm } from './form';
import { useAdventureFormOptions } from './useAdventureFormOptions';

export function AdventuresScreen ({ onChatVisibleChange }: AdventuresScreenProps) {
  const controllers = useControllers();
  const { createAdventure, editAdventure, eraseAdventure, getAdventures } = controllers;
  const formOptions = useAdventureFormOptions(controllers);
  const [showChat, setShowChat] = useState(false);
  const [selectedAdventure, setSelectedAdventure] = useState<Adventure | null>(null);
  const [systemPromptView, setSystemPromptView] = useState<SystemPromptViewData | null>(null);

  const isChatVisible = showChat && selectedAdventure !== null;

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
  } = useEntityScreen({
    fetch: () => getAdventures.handle(),
    submit: (adventureForm) => submitAdventure(adventureForm, createAdventure, editAdventure),
    erase: (id) => eraseAdventure.handle(id),
    toFormState: (adventure) => toAdventureFormState(adventure, { characters: formOptions.characters.items, systemPrompts: formOptions.systemPrompts.items, worldMasters: formOptions.worldMasters.items, worlds: formOptions.worlds.items, locations: formOptions.locations.items, items: formOptions.items.items }),
    initialForm: initialAdventureForm,
    validate: validateAdventureForm,
    entityName: 'adventure',
  });

  const handleChat = (adventure: Adventure) => {
    setSelectedAdventure(adventure);
    setShowChat(true);
  };

  const handleViewSystemPrompt = async (adventure: Adventure) => {
    const data = await onViewSystemPrompt(controllers.getAdventureSystemPrompt, controllers.getAdventureText, adventure);
    setSystemPromptView(data);
  };

  const handleBackFromSystemPromptViewer = () => {
    setSystemPromptView(null);
  };

  const chatScreenControllers: AdventureChatScreenControllers = {
    getAdventures,
    editAdventure,
    hydrateAdventure: controllers.hydrateAdventure,
    createChatAdventure: controllers.createChatAdventure,
    appendChatAdventure: controllers.appendChatAdventure,
    startStreamingChat: controllers.startStreamingChat,
    updateStreamingChat: controllers.updateStreamingChat,
    finishStreamingChat: controllers.finishStreamingChat,
    getAdventureText: controllers.getAdventureText,
    getNativeStreamCompletion: controllers.getNativeStreamCompletion,
    getWorldMasters: controllers.getWorldMasters,
  };

  const handleBackFromChat = () => {
    setShowChat(false);
    setSelectedAdventure(null);
    reload();
  };

  const renderActions = (adventure: Adventure) => (
    <>
      <TouchableOpacity style={screenStyles.actionButton} onPress={() => handleChat(adventure)}>
        <MessageSquare size={16} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={screenStyles.actionButton} onPress={() => handleViewSystemPrompt(adventure)}>
        <Scroll size={16} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={screenStyles.actionButton} onPress={() => openEdit(adventure)}>
        <Pencil size={16} color={colors.text} />
      </TouchableOpacity>
      <TouchableOpacity style={screenStyles.actionButton} onPress={() => eraseEntity(adventure)}>
        <Trash2 size={16} color={colors.text} />
      </TouchableOpacity>
    </>
  );

  const renderForm = () => (
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
        getDetailText={(adventure) => `Created: ${adventure.createdAt.toLocaleDateString()}`}
        renderActions={renderActions}
        isFormOpen={showForm}
        renderForm={renderForm}
      />

      {showChat && selectedAdventure && (
        <View style={styles.chatOverlay}>
          <AdventureChatScreen
            adventure={selectedAdventure}
            onBack={handleBackFromChat}
            controllers={chatScreenControllers}
          />
        </View>
      )}

      {systemPromptView && (
        <View style={styles.chatOverlay}>
          <SystemPromptViewer data={systemPromptView} onBack={handleBackFromSystemPromptViewer} />
        </View>
      )}
    </View>
  );
}

import { useCallback } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MessageSquare, Pencil, Scroll, Trash2 } from 'lucide-react-native';
import { AdventureDetails, AdventureListItem } from '@domain/controllers';
import { CrudEntityList, IconButton, screenStyles } from '@presentation/components';
import { useEntityScreen } from '@presentation/hooks';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { AdventureForm } from './form/AdventureForm';
import {
  initialAdventureForm,
  submitAdventure,
  toAdventureFormState,
  validateAdventureForm,
  type AdventureFormData,
} from './form/adventureForm';
import { useAdventureFormOptions } from './form/useAdventureFormOptions';

const getCreatedAtText = (adventure: AdventureListItem) => `Created: ${new Date(adventure.createdAt).toLocaleDateString()}`;

export function AdventuresScreen () {
  const navigation = useNavigation();
  const controllers = useControllers();
  const { createAdventure, editAdventure, eraseAdventure, getAdventures, getAdventure, alert } = controllers;
  const options = useAdventureFormOptions(controllers);

  const screen = useEntityScreen<AdventureListItem, AdventureFormData, AdventureDetails>({
    fetch: () => getAdventures.handle(),
    load: id => getAdventure.handle({ id }),
    submit: form => submitAdventure(form, createAdventure, editAdventure),
    erase: id => eraseAdventure.handle({ id }),
    toFormState: adventure => toAdventureFormState(adventure, options),
    initialForm: initialAdventureForm,
    validate: validateAdventureForm,
    entityName: 'adventure',
    alert,
  });

  const { openEdit, eraseEntity } = screen;
  const renderActions = useCallback((adventure: AdventureListItem) => (
    <>
      <IconButton
        icon={MessageSquare}
        accessibilityLabel="Open chat"
        onPress={() => navigation.navigate('adventureChat', { adventureId: adventure.id })}
      />
      <IconButton
        icon={Scroll}
        accessibilityLabel="View prompt"
        onPress={() => navigation.navigate('adventurePrompt', { adventureId: adventure.id })}
      />
      <IconButton icon={Pencil} accessibilityLabel="Edit" onPress={() => openEdit(adventure)} />
      <IconButton icon={Trash2} accessibilityLabel="Delete" onPress={() => eraseEntity(adventure)} />
    </>
  ), [navigation, openEdit, eraseEntity]);

  return (
    <View style={screenStyles.container}>
      <CrudEntityList
        items={screen.entities}
        isLoading={screen.isLoading}
        isError={screen.isError}
        errorMessage="Failed to load adventures."
        emptyText="No adventures found."
        addLabel="Add Adventure"
        onAdd={screen.openAdd}
        onEdit={screen.openEdit}
        onDelete={screen.eraseEntity}
        getDetailText={getCreatedAtText}
        renderActions={renderActions}
        form={screen.showForm && (
          <AdventureForm
            form={screen.form}
            formErrors={screen.formErrors}
            options={options}
            onChange={screen.updateFields}
            onCancel={screen.closeForm}
            onSave={screen.save}
          />
        )}
      />
    </View>
  );
}

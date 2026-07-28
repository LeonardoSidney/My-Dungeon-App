import React, { useState } from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Adventure, Character, SystemPrompt, WorldMaster, World, Location, Item } from '@domain/entities';
import { styles } from './styles';
import { AdventuresPanel } from './adventuresPanel';
import { AdventuresForm } from './adventuresForm';
import { useAdventuresScreenLogic } from './useAdventuresScreenLogic';
import { useCharactersLoad } from './useCharactersLoad';
import { useSystemPromptsLoad } from './useSystemPromptsLoad';
import { useWorldMastersLoad } from './useWorldMastersLoad';
import { useWorldsLoad } from './useWorldsLoad';
import { useLocationsLoad } from './useLocationsLoad';
import { useItemsLoad } from './useItemsLoad';
import { onEraseAdventure } from './onEraseAdventure';
import { onAddNewAdventure } from './onAddNewAdventure';
import { onCancelForm } from './onCancelForm';
import { onEditForm } from './onEditForm';
import { onSaveAdventure } from './onSaveAdventure';
import { handleAdventureFormChange } from './handleAdventureFormChange';
import { setInitialAdventureState } from './setInitialAdventureState';
import { AdventureFormData, FormErrors } from './constants';

export function AdventuresScreen () {
  const [adventures, setAdventures] = useState<Adventure[]>([]);
  const [adventureStateFormData, setAdventureFormData] = useState<AdventureFormData>(setInitialAdventureState());
  const [showForm, setShowForm] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [characters, setCharacters] = useState<Character[]>([]);
  const [systemPrompts, setSystemPrompts] = useState<SystemPrompt[]>([]);
  const [worldMasters, setWorldMasters] = useState<WorldMaster[]>([]);
  const [worlds, setWorlds] = useState<World[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [items, setItems] = useState<Item[]>([]);

  useAdventuresScreenLogic(setAdventures);
  useCharactersLoad(setCharacters);
  useSystemPromptsLoad(setSystemPrompts);
  useWorldMastersLoad(setWorldMasters);
  useWorldsLoad(setWorlds);
  useLocationsLoad(setLocations);
  useItemsLoad(setItems);

  const handleFormSave = async () => {
    const errors: FormErrors = {};
    if (!adventureStateFormData.name.trim()) errors.name = 'Name is required';
    if (adventureStateFormData.systemPrompts.length < 1) errors.systemPrompts = 'A system prompt is required';
    if (adventureStateFormData.characters.length < 1) errors.characters = 'At least one character is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      await onSaveAdventure(
        { ...adventureStateFormData, avaliableCharacters: characters },
        setAdventureFormData,
        setShowForm,
        setAdventures
      );
    } catch (error) {
      setFormErrors({ name: (error as Error).message });
    }
  };

  const handleFormChange = (field: keyof AdventureFormData, value: any) => {
    setFormErrors(prev => {
      const next = { ...prev };
      const errorField = field as keyof FormErrors;
      if (next[errorField]) {
        delete next[errorField];
      }
      return next;
    });
    handleAdventureFormChange(setAdventureFormData)(field, value);
  };

  const handleAddNewAdventure = () => {
    setFormErrors({});
    onAddNewAdventure(setShowForm, setAdventureFormData);
  };

  const handleEditAdventure = (adventure: Adventure) => {
    setFormErrors({});
    onEditForm(adventure, setShowForm, setAdventureFormData);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>Adventures</Text>
        </View>

        <AdventuresPanel
          adventures={adventures}
          onEdit={handleEditAdventure}
          onDelete={(adventure) => onEraseAdventure(adventure, setAdventures)}
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddNewAdventure}
        >
          <Text style={styles.addButtonText}>Add Adventure</Text>
        </TouchableOpacity>

        <AdventuresForm
          showForm={showForm}
          adventureStateFormData={adventureStateFormData}
          onChange={handleFormChange}
          onCancel={() => onCancelForm(setShowForm, setAdventureFormData)}
          onSave={handleFormSave}
          formErrors={formErrors}
          characters={characters}
          systemPrompts={systemPrompts}
          worldMasters={worldMasters}
          worlds={worlds}
          locations={locations}
          items={items}
        />

      </ScrollView>
    </View>
  );
}

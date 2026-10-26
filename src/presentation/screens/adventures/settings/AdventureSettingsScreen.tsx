import { useCallback } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EntityOption } from '@domain/controllers';
import { screenStyles } from '@presentation/components';
import type { RootParamList } from '@presentation/navigation/routes';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { colors } from '@presentation/theme';
import { DetailHeader } from '../DetailHeader';
import {
  assignCharacterRole,
  CharacterRoleEnum,
  getCharacterRole,
  selectWorldMaster,
  type CharacterRole,
} from '../form/adventureRoster';
import { useAdventureFormOptions, type AdventureFormOptions } from '../form/useAdventureFormOptions';
import { CastSection } from './components/CastSection';
import { GeneralSection } from './components/GeneralSection';
import { GenerationSection } from './components/GenerationSection';
import { NarratorSection } from './components/NarratorSection';
import { SettingsActionBar } from './components/SettingsActionBar';
import { StoryContextSection } from './components/StoryContextSection';
import { useAdventureSettings } from './hooks/useAdventureSettings';
import { useGenerationCatalog, type ReloadableGenerationCatalog } from './hooks/useGenerationCatalog';
import { useGenerationVoices } from './hooks/useGenerationVoices';
import { SettingsSectionEnum, type AdventureSettingsForm, type GenerationVoice, type SettingsSection } from './adventureSettingsForm';

type AdventureSettingsScreenProps = NativeStackScreenProps<RootParamList, 'adventureSettings'>;

type AdventureSettings = ReturnType<typeof useAdventureSettings>;

type SettingsContentProps = {
  draft: AdventureSettingsForm;
  settings: AdventureSettings;
  options: AdventureFormOptions;
  voices: { aiVoices: GenerationVoice[]; playerVoices: GenerationVoice[]; allVoices: GenerationVoice[]; };
  catalog: ReloadableGenerationCatalog;
};

function SettingsContent ({ draft, settings, options, voices, catalog }: SettingsContentProps) {
  const { adventure } = draft;
  const { changeAdventure, errors, modifiedSections } = settings;
  const generationProps = {
    allVoices: voices.allVoices,
    edits: draft.generation,
    catalog,
    samplerErrors: errors.samplers,
    onAssistantChange: settings.changeVoiceAssistant,
    onSamplerChange: settings.changeAssistantSampler,
    onSamplerValueChange: settings.changeSamplerValue,
  };

  const getRole = useCallback((characterId: string) => getCharacterRole(adventure, characterId), [adventure]);

  const changeRole = useCallback((character: EntityOption, role: CharacterRole) => {
    changeAdventure(assignCharacterRole(adventure, character, role));
  }, [adventure, changeAdventure]);

  const chooseWorldMaster = useCallback((chosen: EntityOption) => {
    changeAdventure(selectWorldMaster(adventure, chosen));
  }, [adventure, changeAdventure]);

  const chooseNarratorCharacter = useCallback((character: EntityOption) => {
    changeRole(character, CharacterRoleEnum.NARRATOR);
  }, [changeRole]);

  const narratorCharacter = options.characters.find(character => character.id === adventure.characterAsWorldMasterId);
  const narratorName = adventure.worldMaster?.name ?? narratorCharacter?.name;

  const isModified = (section: SettingsSection) => Boolean(modifiedSections?.[section]);

  return (
    <ScrollView keyboardShouldPersistTaps="handled" nestedScrollEnabled style={styles.content}>
      <GeneralSection
        name={adventure.name}
        error={errors.name}
        isModified={isModified(SettingsSectionEnum.GENERAL)}
        onNameChange={name => changeAdventure({ name })}
      />
      <NarratorSection
        narratorMode={draft.narratorMode}
        narratorName={narratorName}
        worldMaster={adventure.worldMaster}
        characterAsWorldMasterId={adventure.characterAsWorldMasterId}
        worldMasters={options.worldMasters}
        characters={options.characters}
        error={errors.narrator}
        isModified={isModified(SettingsSectionEnum.NARRATOR)}
        onModeChange={settings.changeNarratorMode}
        onSelectWorldMaster={chooseWorldMaster}
        onSelectCharacter={chooseNarratorCharacter}
      />
      <CastSection
        characters={options.characters}
        getRole={getRole}
        error={errors.cast}
        isModified={isModified(SettingsSectionEnum.CAST)}
        onRoleChange={changeRole}
      />
      <StoryContextSection
        selected={adventure}
        options={options}
        systemPromptsError={errors.systemPrompts}
        isModified={isModified(SettingsSectionEnum.CONTEXT)}
        onChange={changeAdventure}
      />
      <GenerationSection
        title="Generation"
        helpText={
          'The assistant, sampler and parameters of every voice the AI controls. Changes are saved to the characters, ' +
          'assistants and samplers themselves, so they apply to every adventure that uses them.'
        }
        emptyText="Pick a narrator or give a character to the AI in Cast."
        voiceLabel="AI voice"
        voices={voices.aiVoices}
        {...generationProps}
      />
      <GenerationSection
        title="Your Characters"
        helpText={
          'The assistant, sampler and parameters that will write the lines of the characters you play. Changes are ' +
          'saved to the characters, assistants and samplers themselves.'
        }
        emptyText="Choose the characters you play in Cast."
        voiceLabel="character"
        voices={voices.playerVoices}
        {...generationProps}
      />
    </ScrollView>
  );
}

export function AdventureSettingsScreen ({ route, navigation }: AdventureSettingsScreenProps) {
  const { adventureId } = route.params;
  const controllers = useControllers();
  const options = useAdventureFormOptions(controllers);
  const settings = useAdventureSettings({ adventureId, options, controllers });
  const { draft, loadError, apply } = settings;
  const voices = useGenerationVoices(draft?.adventure, options.characters);
  const catalog = useGenerationCatalog({ voices: voices.allVoices, controllers });
  const { reload: reloadCatalog } = catalog;
  const title = draft ? `${draft.adventure.name} · Settings` : 'Settings';

  const applySettings = useCallback(async () => {
    await apply();
    await reloadCatalog();
  }, [apply, reloadCatalog]);

  const renderBody = () => {
    if (loadError) {
      return <Text style={screenStyles.errorText}>{loadError}</Text>;
    }
    if (!draft) {
      return <ActivityIndicator style={styles.loading} size="large" color={colors.text} />;
    }
    return (
      <SettingsContent
        draft={draft}
        settings={settings}
        options={options}
        voices={voices}
        catalog={catalog}
      />
    );
  };

  return (
    <View style={styles.container}>
      <DetailHeader title={title} onBack={navigation.goBack} />
      {renderBody()}
      {settings.hasUnsavedChanges && (
        <SettingsActionBar
          hasErrors={settings.hasErrors}
          isApplying={settings.isApplying}
          onDiscard={settings.discard}
          onApply={applySettings}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: 12,
  },
  loading: {
    marginTop: 40,
  },
});

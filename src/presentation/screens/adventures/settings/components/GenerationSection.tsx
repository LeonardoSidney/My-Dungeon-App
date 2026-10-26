import { Text } from 'react-native';
import { CollapsibleSection, screenStyles } from '@presentation/components';
import type { GenerationVoice } from '../adventureSettingsForm';
import type { GenerationEdits } from '../generationEdits';
import type { SamplerValues } from '../samplerValues';
import { isVoiceEdited, resolveVoiceRuntime, type GenerationCatalog } from '../voiceRuntime';
import { ModifiedTag } from './ModifiedTag';
import { VoiceGenerationList, type VoiceGenerationHandlers } from './VoiceGenerationList';
import { sectionStyles } from './settingsSection.styles';

type GenerationSectionProps = VoiceGenerationHandlers & {
  title: string;
  helpText: string;
  emptyText: string;
  voiceLabel: string;
  voices: GenerationVoice[];
  allVoices: GenerationVoice[];
  edits: GenerationEdits;
  catalog: GenerationCatalog;
  samplerErrors?: Record<string, SamplerValues>;
};

function summarize (voices: GenerationVoice[], editedCount: number, voiceLabel: string): string {
  if (voices.length === 0) {
    return `No ${voiceLabel}s`;
  }
  const voicesText = voices.length === 1 ? `1 ${voiceLabel}` : `${voices.length} ${voiceLabel}s`;
  return `${voicesText} · ${editedCount} edited`;
}

export function GenerationSection ({
  title,
  helpText,
  emptyText,
  voiceLabel,
  voices,
  allVoices,
  edits,
  catalog,
  samplerErrors,
  ...handlers
}: GenerationSectionProps) {
  const editedCount = voices.filter(voice => isVoiceEdited(resolveVoiceRuntime(voice.id, edits, catalog))).length;

  return (
    <CollapsibleSection
      title={title}
      summary={summarize(voices, editedCount, voiceLabel)}
      accessory={<ModifiedTag isModified={editedCount > 0} />}
    >
      <Text style={sectionStyles.helpText}>{helpText}</Text>

      {voices.length === 0 && <Text style={screenStyles.emptyText}>{emptyText}</Text>}

      <VoiceGenerationList
        voices={voices}
        allVoices={allVoices}
        edits={edits}
        catalog={catalog}
        samplerErrors={samplerErrors}
        {...handlers}
      />
    </CollapsibleSection>
  );
}

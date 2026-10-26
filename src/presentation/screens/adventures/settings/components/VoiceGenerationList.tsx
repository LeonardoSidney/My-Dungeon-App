import { useCallback, useState } from 'react';
import type { GenerationVoice } from '../adventureSettingsForm';
import type { GenerationEdits } from '../generationEdits';
import type { SamplerValueKey, SamplerValues } from '../samplerValues';
import { findVoiceSharing, resolveVoiceRuntime, type GenerationCatalog } from '../voiceRuntime';
import { VoiceGenerationCard } from './VoiceGenerationCard';

export type VoiceGenerationHandlers = {
  onAssistantChange: (voiceId: string, assistantId: string | undefined, savedAssistantId: string | undefined) => void;
  onSamplerChange: (assistantId: string, samplerId: string | undefined, savedSamplerId: string | undefined) => void;
  onSamplerValueChange: (samplerId: string, key: SamplerValueKey, value: string, savedValues: SamplerValues) => void;
};

type VoiceGenerationListProps = VoiceGenerationHandlers & {
  voices: GenerationVoice[];
  allVoices: GenerationVoice[];
  edits: GenerationEdits;
  catalog: GenerationCatalog;
  samplerErrors?: Record<string, SamplerValues>;
};

export function VoiceGenerationList ({
  voices,
  allVoices,
  edits,
  catalog,
  samplerErrors,
  onAssistantChange,
  onSamplerChange,
  onSamplerValueChange,
}: VoiceGenerationListProps) {
  const [expandedVoiceId, setExpandedVoiceId] = useState<string | null>(null);

  const toggleVoice = useCallback((voiceId: string) => {
    setExpandedVoiceId(current => {
      if (current === voiceId) {
        return null;
      }
      return voiceId;
    });
  }, []);

  return (
    <>
      {voices.map(voice => {
        const runtime = resolveVoiceRuntime(voice.id, edits, catalog);
        const samplerId = runtime.sampler?.id;
        const errors = samplerId ? samplerErrors?.[samplerId] : undefined;
        return (
          <VoiceGenerationCard
            key={voice.id}
            voice={voice}
            runtime={runtime}
            sharing={findVoiceSharing(voice, allVoices, edits, catalog)}
            catalog={catalog}
            errors={errors}
            isExpanded={expandedVoiceId === voice.id}
            onToggle={toggleVoice}
            onAssistantChange={onAssistantChange}
            onSamplerChange={onSamplerChange}
            onSamplerValueChange={onSamplerValueChange}
          />
        );
      })}
    </>
  );
}

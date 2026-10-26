import { Text, TouchableOpacity, View } from 'react-native';
import { VoiceRoleEnum, type GenerationVoice, type VoiceRole } from '../adventureSettingsForm';
import type { SamplerValueKey, SamplerValues } from '../samplerValues';
import { isVoiceEdited, type GenerationCatalog, type VoiceRuntime, type VoiceSharing } from '../voiceRuntime';
import { GenerationSourceCard } from './GenerationSourceCard';
import { SamplerParameters } from './SamplerParameters';
import { styles } from './VoiceGenerationCard.styles';

type VoiceGenerationCardProps = {
  voice: GenerationVoice;
  runtime: VoiceRuntime;
  sharing: VoiceSharing;
  catalog: GenerationCatalog;
  errors?: SamplerValues;
  isExpanded: boolean;
  onToggle: (voiceId: string) => void;
  onAssistantChange: (voiceId: string, assistantId: string | undefined, savedAssistantId: string | undefined) => void;
  onSamplerChange: (assistantId: string, samplerId: string | undefined, savedSamplerId: string | undefined) => void;
  onSamplerValueChange: (samplerId: string, key: SamplerValueKey, value: string, savedValues: SamplerValues) => void;
};

const roleLabels: Record<VoiceRole, string> = {
  [VoiceRoleEnum.NARRATOR]: 'Narrator',
  [VoiceRoleEnum.AI]: 'AI character',
  [VoiceRoleEnum.PLAYER]: 'Played by you',
};

const pendingNotices: Partial<Record<VoiceRole, string>> = {
  [VoiceRoleEnum.AI]: 'Today the narrator writes the AI characters\' lines, so these settings take effect once AI characters reply on their own.',
  [VoiceRoleEnum.PLAYER]: 'These settings take effect once the app can write your character\'s reply for you.',
};

function describeAssistantOrigin (voice: GenerationVoice, runtime: VoiceRuntime): string {
  if (!runtime.isAssistantEdited) {
    return `From ${voice.name}'s profile`;
  }
  return `Will be saved to ${voice.name}'s profile · was ${runtime.savedAssistant?.name ?? 'none'}`;
}

function describeSamplerOrigin (runtime: VoiceRuntime): string {
  const assistantName = runtime.assistant?.name ?? 'the assistant';
  if (!runtime.isSamplerEdited) {
    return `From ${assistantName}`;
  }
  return `Will be saved to ${assistantName} · was ${runtime.savedSampler?.name ?? 'none'}`;
}

function describeAssistantSharing (runtime: VoiceRuntime, sharing: VoiceSharing): string | undefined {
  if (sharing.assistant.length === 0) {
    return undefined;
  }
  return `${runtime.assistant?.name} is also used by ${sharing.assistant.join(', ')}: they get this sampler too.`;
}

function summarize (runtime: VoiceRuntime): string {
  const assistantName = runtime.assistant?.name ?? 'No assistant';
  const samplerName = runtime.sampler?.name ?? 'No sampler';
  return `${assistantName} · ${samplerName}`;
}

export function VoiceGenerationCard ({
  voice,
  runtime,
  sharing,
  catalog,
  errors,
  isExpanded,
  onToggle,
  onAssistantChange,
  onSamplerChange,
  onSamplerValueChange,
}: VoiceGenerationCardProps) {
  const { assistant, sampler, connection, savedAssistant, savedSampler } = runtime;
  const isEdited = isVoiceEdited(runtime);
  const connectionName = connection?.name ?? assistant?.connectionId;
  const modelDetails = assistant ? `${assistant.modelId} · ${connectionName}` : undefined;
  const expandIcon = isExpanded ? '▾' : '▸';
  const hasErrors = Boolean(errors);
  const pendingNotice = pendingNotices[voice.role];

  const changeSampler = (samplerId: string | undefined) => {
    if (!assistant) {
      return;
    }
    onSamplerChange(assistant.id, samplerId, savedSampler?.id);
  };

  return (
    <View style={[styles.card, isEdited && styles.cardEdited, hasErrors && styles.cardError]}>
      <TouchableOpacity
        style={styles.header}
        onPress={() => onToggle(voice.id)}
        accessibilityRole="button"
        accessibilityState={{ expanded: isExpanded }}
      >
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{voice.name.charAt(0).toUpperCase()}</Text>
        </View>
        <View style={styles.headerTexts}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>{voice.name}</Text>
            <Text style={styles.role}>{roleLabels[voice.role]}</Text>
          </View>
          <Text style={styles.summary} numberOfLines={1}>{summarize(runtime)}</Text>
        </View>
        {isEdited && <Text style={styles.edited}>Edited</Text>}
        <Text style={styles.expandIcon}>{expandIcon}</Text>
      </TouchableOpacity>

      {isExpanded && (
        <View style={styles.body}>
          {pendingNotice && <Text style={styles.notice}>{pendingNotice}</Text>}
          <GenerationSourceCard
            step={1}
            label="Assistant"
            value={assistant?.name ?? 'No assistant'}
            origin={describeAssistantOrigin(voice, runtime)}
            details={modelDetails}
            isEdited={runtime.isAssistantEdited}
            resetLabel="Undo"
            items={catalog.assistants}
            selectedId={assistant?.id}
            emptyMessage="No assistants created yet"
            onSelect={item => onAssistantChange(voice.id, item.id, savedAssistant?.id)}
            onReset={() => onAssistantChange(voice.id, savedAssistant?.id, savedAssistant?.id)}
          />
          <GenerationSourceCard
            step={2}
            label="Sampler"
            value={sampler?.name ?? 'No sampler'}
            origin={describeSamplerOrigin(runtime)}
            note={describeAssistantSharing(runtime, sharing)}
            isEdited={runtime.isSamplerEdited}
            isDisabled={!assistant}
            resetLabel="Undo"
            items={catalog.samplers}
            selectedId={sampler?.id}
            emptyMessage="No samplers created yet"
            onSelect={item => changeSampler(item.id)}
            onReset={() => changeSampler(savedSampler?.id)}
          />
          {sampler && (
            <SamplerParameters
              key={sampler.id}
              step={3}
              sampler={sampler}
              values={runtime.samplerValues}
              savedValues={runtime.savedSamplerValues}
              errors={errors}
              sharedWith={sharing.sampler}
              onChange={(key, value) => onSamplerValueChange(sampler.id, key, value, runtime.savedSamplerValues)}
            />
          )}
        </View>
      )}
    </View>
  );
}

import React from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { HOME_DRAFT_ID } from '@domain/constants/draft';
import { useControllers } from '@application/ui/providers/controllersProvider';
import { useDraft } from './hooks/useDraft';
import { toggleDraftCompletion } from './toggleDraftCompletion';
import { saveDraftEdit } from './saveDraftEdit';
import { TextAreaStreamProps } from './constants';
import { buttonStyles, styles } from './styles';

export function TextAreaStream ({ prompt, setPrompt }: TextAreaStreamProps) {
  const {
    getDraft,
    saveDraft,
    startDraftCompletion,
    stopDraftCompletion,
    subscribeDraft,
    alert,
  } = useControllers();

  const { isStreaming } = useDraft({ draftId: HOME_DRAFT_ID, getDraft, subscribeDraft, setPrompt, alert });

  const handleStreamToggle = () => toggleDraftCompletion({
    draftId: HOME_DRAFT_ID,
    prompt,
    isStreaming,
    startDraftCompletion,
    stopDraftCompletion,
    alert,
  });

  const handleBlur = () => saveDraftEdit({ draftId: HOME_DRAFT_ID, content: prompt, saveDraft, alert });

  const buttonLabel = isStreaming ? 'Stop Stream' : 'Start Stream';

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={prompt}
        onChangeText={setPrompt}
        onBlur={handleBlur}
        editable={!isStreaming}
        multiline
        placeholder="Enter your prompt..."
      />
      <Pressable onPress={handleStreamToggle} style={buttonStyles.stream}>
        <Text style={buttonStyles.text}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

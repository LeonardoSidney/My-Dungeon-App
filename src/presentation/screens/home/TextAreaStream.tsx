import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { HOME_DRAFT_ID } from '@domain/constants/draft';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { colors } from '@presentation/theme';
import { useDraft } from './useDraft';
import { saveDraftEdit, toggleDraftCompletion } from './draftActions';

export function TextAreaStream () {
  const { getDraft, saveDraft, startDraftCompletion, stopDraftCompletion, subscribeDraft, alert } = useControllers();
  const [prompt, setPrompt] = useState('');
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
      <Pressable onPress={handleStreamToggle} style={styles.streamButton}>
        <Text style={styles.streamButtonText}>{isStreaming ? 'Stop Stream' : 'Start Stream'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    paddingTop: 16,
    gap: 10,
    justifyContent: 'flex-end',
    paddingBottom: 50,
  },
  textInput: {
    flex: 1,
    backgroundColor: colors.text,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    lineHeight: 22,
    minHeight: 150,
  },
  streamButton: {
    backgroundColor: colors.primaryBright,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  streamButtonText: {
    color: colors.text,
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
});

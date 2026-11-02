import { useLayoutEffect, useRef } from 'react';
import { TextInput, useWindowDimensions, type StyleProp, type TextStyle } from 'react-native';
import { editInputStyle } from '../chatMessage.styles';

type EditDraftInputWebProps = {
  value: string;
  onChangeText: (value: string) => void;
  style?: StyleProp<TextStyle>;
};

export function EditDraftInput ({ value, onChangeText, style }: EditDraftInputWebProps) {
  const inputRef = useRef<TextInput>(null);
  const { width: windowWidth } = useWindowDimensions();

  useLayoutEffect(() => {
    const textArea = inputRef.current as unknown as HTMLTextAreaElement | null;
    const container = textArea?.parentElement;
    if (!textArea || !container) {
      return;
    }

    const borderHeight = textArea.offsetHeight - textArea.clientHeight;

    container.style.minHeight = `${container.offsetHeight}px`;
    textArea.style.height = 'auto';
    textArea.style.height = `${textArea.scrollHeight + borderHeight}px`;
    container.style.minHeight = '';
  }, [value, windowWidth]);

  return (
    <TextInput
      ref={inputRef}
      style={[editInputStyle, style]}
      value={value}
      onChangeText={onChangeText}
      multiline
      textAlignVertical="top"
      selectionColor="transparent"
    />
  );
}

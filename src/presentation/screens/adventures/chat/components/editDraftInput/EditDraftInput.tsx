import { TextInput, type StyleProp, type TextStyle } from 'react-native';
import { editInputStyle } from '../chatMessage.styles';

type EditDraftInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  style?: StyleProp<TextStyle>;
};

export function EditDraftInput ({ value, onChangeText, style }: EditDraftInputProps) {
  return (
    <TextInput
      style={[editInputStyle, style]}
      value={value}
      onChangeText={onChangeText}
      multiline
      textAlignVertical="top"
      selectionColor="transparent"
    />
  );
}

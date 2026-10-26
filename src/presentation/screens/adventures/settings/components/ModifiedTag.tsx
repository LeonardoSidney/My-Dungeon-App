import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@presentation/theme';

type ModifiedTagProps = {
  isModified?: boolean;
};

export function ModifiedTag ({ isModified = false }: ModifiedTagProps) {
  if (!isModified) {
    return null;
  }

  return (
    <View style={styles.modifiedTag}>
      <Text style={styles.tagText}>Modified</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  modifiedTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.text,
  },
});

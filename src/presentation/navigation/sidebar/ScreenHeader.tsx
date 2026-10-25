import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@presentation/theme';

export const HEADER_HEIGHT = 56;

type ScreenHeaderProps = {
  title: string;
  isWideScreen: boolean;
};

export function ScreenHeader ({ title, isWideScreen }: ScreenHeaderProps) {
  return (
    <View style={[styles.header, !isWideScreen && styles.headerMobile]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerMobile: {
    paddingLeft: 68,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.text,
  },
});

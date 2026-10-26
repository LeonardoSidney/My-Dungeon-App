import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@presentation/theme';

type HomeSectionProps = {
  title?: string;
  accessory?: ReactNode;
  children: ReactNode;
};

export function HomeSection ({ title, accessory, children }: HomeSectionProps) {
  return (
    <View style={styles.section}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          {accessory}
        </View>
      )}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
});

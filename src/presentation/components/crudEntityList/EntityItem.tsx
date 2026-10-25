import { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors } from '@presentation/theme';

type EntityItemProps = {
  name: string;
  details?: string;
  detailLines?: number;
  actions?: ReactNode;
};

export function EntityItem ({ name, details, detailLines, actions }: EntityItemProps) {
  return (
    <View style={styles.item}>
      <View style={styles.info}>
        <Text style={styles.name}>{name}</Text>
        {details ? (
          <Text style={styles.details} numberOfLines={detailLines}>
            {details}
          </Text>
        ) : null}
      </View>
      {actions && <View style={styles.actions}>{actions}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.surface,
    borderRadius: 8,
    marginBottom: 8,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  details: {
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginLeft: 12,
  },
});

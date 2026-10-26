import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Server } from 'lucide-react-native';
import { colors } from '@presentation/theme';
import type { ServerStatus } from '../homeOverview';
import { homeCardStyles } from './homeCard.styles';

type ServerStatusCardProps = {
  servers: ServerStatus[] | null;
  error: string | null;
  onOpenSettings: () => void;
};

function describeServer (server: ServerStatus): string {
  if (server.modelCount === 0) {
    return 'offline or no models';
  }
  if (server.modelCount === 1) {
    return '1 model available';
  }
  return `${server.modelCount} models available`;
}

export function ServerStatusCard ({ servers, error, onOpenSettings }: ServerStatusCardProps) {
  const isLoading = !servers && !error;
  const hasNoServers = servers?.length === 0;

  return (
    <TouchableOpacity style={[homeCardStyles.card, styles.card]} onPress={onOpenSettings} accessibilityRole="button">
      <Server size={18} color={colors.textMuted} />
      <View style={styles.lines}>
        {isLoading && <Text style={homeCardStyles.muted}>Checking your servers...</Text>}
        {error && <Text style={styles.offline}>{error}</Text>}
        {hasNoServers && <Text style={homeCardStyles.muted}>No server connected yet</Text>}
        {servers?.map(server => {
          const isOnline = server.modelCount > 0;
          return (
            <View key={server.id} style={styles.server}>
              <View style={[styles.dot, isOnline && styles.dotOnline]} />
              <Text style={homeCardStyles.rowTitle} numberOfLines={1}>{server.name}</Text>
              <Text style={homeCardStyles.muted}>{describeServer(server)}</Text>
            </View>
          );
        })}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingVertical: 12,
  },
  lines: {
    flex: 1,
    gap: 6,
  },
  server: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.dangerSoft,
  },
  dotOnline: {
    backgroundColor: colors.successBright,
  },
  offline: {
    fontSize: 13,
    color: colors.dangerSoft,
  },
});

import { Text, TouchableOpacity } from 'react-native';
import { Pencil, Trash2 } from 'lucide-react-native';
import { ConnectionListItem } from '@domain/controllers';
import { CollapsibleSection, EntityItem, IconButton, screenStyles } from '@presentation/components';

type ConnectionPanelProps = {
  connections: ConnectionListItem[];
  isLoading: boolean;
  isError: boolean;
  onAdd: () => void;
  onEdit: (connection: ConnectionListItem) => void;
  onDelete: (connection: ConnectionListItem) => void;
};

function formatAddress (connection: ConnectionListItem): string {
  return connection.port ? `${connection.ip}:${connection.port}` : connection.ip;
}

export function ConnectionPanel ({ connections, isLoading, isError, onAdd, onEdit, onDelete }: ConnectionPanelProps) {
  const renderConnections = () => {
    if (isLoading) {
      return <Text style={screenStyles.loadingText}>Loading...</Text>;
    }
    if (isError) {
      return <Text style={screenStyles.errorText}>Failed to load connections.</Text>;
    }
    if (connections.length === 0) {
      return <Text style={screenStyles.emptyText}>No connections found.</Text>;
    }
    return connections.map(connection => (
      <EntityItem
        key={connection.id}
        name={connection.name}
        details={formatAddress(connection)}
        actions={(
          <>
            <IconButton icon={Pencil} accessibilityLabel="Edit" onPress={() => onEdit(connection)} />
            <IconButton icon={Trash2} accessibilityLabel="Delete" onPress={() => onDelete(connection)} />
          </>
        )}
      />
    ));
  };

  return (
    <CollapsibleSection title="Connections">
      {renderConnections()}
      <TouchableOpacity style={screenStyles.addButton} onPress={onAdd}>
        <Text style={screenStyles.addButtonText}>Add Connection</Text>
      </TouchableOpacity>
    </CollapsibleSection>
  );
}

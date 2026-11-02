import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { AlertAction, AlertActionStyle, AlertActionStyleEnum } from '@domain/use-cases';
import { styles } from './WebAlertModal.styles';

export type WebAlertModalProps = {
    title: string;
    message: string;
    actions?: AlertAction[];
    onDismiss: () => void;
};

const DEFAULT_ACTIONS: AlertAction[] = [{ label: 'OK' }];

function getLabelStyle (style?: AlertActionStyle) {
  if (style === AlertActionStyleEnum.CANCEL) {
    return [styles.buttonText, styles.cancelButtonText];
  }
  if (style === AlertActionStyleEnum.DESTRUCTIVE) {
    return [styles.buttonText, styles.destructiveButtonText];
  }
  return styles.buttonText;
}

export function WebAlertModal (params: WebAlertModalProps) {
  const { title, message, actions = DEFAULT_ACTIONS, onDismiss } = params;

  return (
    <Modal visible transparent animationType="fade" statusBarTranslucent>
      <View style={styles.backdrop}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.footer}>
            {actions.map(action => {
              const handlePress = () => {
                onDismiss();
                action.onPress?.();
              };

              return (
                <TouchableOpacity
                  key={action.label}
                  accessibilityRole="button"
                  accessibilityLabel={action.label}
                  style={styles.button}
                  onPress={handlePress}
                >
                  <Text style={getLabelStyle(action.style)}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

import { Modal, Text, TouchableOpacity, View } from 'react-native';
import { AlertAction, AlertActionStyleEnum } from '@domain/use-cases';
import { styles } from './WebAlertModal.styles';

export type WebAlertModalProps = {
    title: string;
    message: string;
    actions?: AlertAction[];
    onDismiss: () => void;
};

const DEFAULT_ACTIONS: AlertAction[] = [{ label: 'OK' }];

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
              const isCancel = action.style === AlertActionStyleEnum.CANCEL;
              const labelStyle = isCancel ? [styles.buttonText, styles.cancelButtonText] : styles.buttonText;
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
                  <Text style={labelStyle}>{action.label}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}

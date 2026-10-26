import { Text, TouchableOpacity, View } from 'react-native';
import { ChevronRight, Circle, CircleCheck } from 'lucide-react-native';
import type { MenuRoute } from '@presentation/navigation/routes';
import { colors } from '@presentation/theme';
import type { SetupStep } from '../homeOverview';
import { homeCardStyles } from './homeCard.styles';

type SetupChecklistProps = {
  steps: SetupStep[];
  onNavigate: (route: MenuRoute) => void;
};

export function SetupChecklist ({ steps, onNavigate }: SetupChecklistProps) {
  const doneCount = steps.filter(step => step.isDone).length;

  return (
    <View style={homeCardStyles.card}>
      <Text style={homeCardStyles.muted}>{`${doneCount} of ${steps.length} done · everything a table needs before the first scene`}</Text>
      {steps.map(step => {
        const StepIcon = step.isDone ? CircleCheck : Circle;
        const iconColor = step.isDone ? colors.successBright : colors.textSubtle;
        return (
          <TouchableOpacity
            key={step.id}
            style={homeCardStyles.row}
            onPress={() => onNavigate(step.route)}
            accessibilityRole="button"
            accessibilityState={{ checked: step.isDone }}
          >
            <StepIcon size={18} color={iconColor} />
            <Text style={[homeCardStyles.rowTitle, homeCardStyles.rowTexts]}>{step.label}</Text>
            <ChevronRight size={18} color={colors.textMuted} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

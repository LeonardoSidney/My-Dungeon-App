import { useCallback } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ChatMessageView } from '@domain/controllers';
import type { RootParamList } from '@presentation/navigation/routes';
import { useControllers } from '@presentation/providers/ControllersProvider';
import { colors } from '@presentation/theme';
import { detailHeaderStyles } from '../DetailHeader';
import { useAdventureCharacters, useAdventureSummary, useAdventureWorldMaster, useChatMessages } from '../adventureQueries';
import { AdventureChat } from './AdventureChat';
import { styles } from './AdventureChatScreen.styles';

type AdventureChatScreenProps = NativeStackScreenProps<RootParamList, 'adventureChat'>;

export function AdventureChatScreen ({ route, navigation }: AdventureChatScreenProps) {
  const { adventureId } = route.params;
  const controllers = useControllers();
  const summary = useAdventureSummary(adventureId, controllers.getAdventureSummary);
  const characters = useAdventureCharacters(adventureId, controllers.getAdventureCharacters);
  const worldMaster = useAdventureWorldMaster(adventureId, controllers.getAdventureWorldMaster);
  const chatMessages = useChatMessages(adventureId, controllers.getChatMessages);
  const { setData: setMessages } = chatMessages;

  const updateMessages = useCallback((update: (messages: ChatMessageView[]) => ChatMessageView[]) => {
    setMessages(current => (current ? update(current) : current));
  }, [setMessages]);

  if (summary.data && characters.data && worldMaster.isLoaded && chatMessages.data) {
    return (
      <AdventureChat
        adventureId={adventureId}
        adventureName={summary.data.name}
        characters={characters.data}
        worldMaster={worldMaster.data}
        messages={chatMessages.data}
        setMessages={setMessages}
        updateMessages={updateMessages}
        onBack={navigation.goBack}
        onOpenSettings={() => navigation.navigate('adventureSettings', { adventureId })}
      />
    );
  }

  const error = summary.error ?? characters.error ?? worldMaster.error ?? chatMessages.error;
  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={navigation.goBack}>
          <Text style={detailHeaderStyles.actionText}>← Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.text} />
      <Text style={styles.loadingText}>Carregando aventura...</Text>
    </View>
  );
}

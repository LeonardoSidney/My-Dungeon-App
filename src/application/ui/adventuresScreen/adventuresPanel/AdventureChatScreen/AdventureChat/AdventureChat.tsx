import { memo, useMemo } from 'react';
import { View } from 'react-native';
import { styles } from './styles';
import { ChatItem } from './ChatItem';
import { getStreamingChatFromList } from './getStreamingChatFromList';
import { AdventureChatProps } from './constants';

function AdventureChatBase ({ chats, streamingChat, onDeleteMessage, onRegenerateFromMessage }: AdventureChatProps) {
  const streamingChatFromList = useMemo(() => getStreamingChatFromList({ streamingChat, chats }), [streamingChat, chats]);
  const streamingChatId = streamingChatFromList?.id ?? null;

  return (
    <View style={styles.container}>
      {chats.map(chat => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isStreaming={chat.id === streamingChatId}
          onDeleteMessage={onDeleteMessage}
          onRegenerateFromMessage={onRegenerateFromMessage}
        />
      ))}
    </View>
  );
}

export const AdventureChat = memo(AdventureChatBase);

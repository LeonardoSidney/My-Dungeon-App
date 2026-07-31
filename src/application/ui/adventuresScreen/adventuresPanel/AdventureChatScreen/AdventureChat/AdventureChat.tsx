import { Text, View, ScrollView } from 'react-native';
import { AdventureChatProps } from './constants';
import { styles } from './styles';
import { AdventureThink } from './AdventureThink';

export function AdventureChat({ chats }: AdventureChatProps) {
  return (
    <ScrollView style={styles.container}>
      {chats.map(chat => {
        const think = chat.think?.[chat.index];
        const hasThink = think?.enabled && !!think.content;

        return (
          <View key={chat.id} style={styles.chatWrapper}>
            {hasThink && <AdventureThink think={think} />}
            <View style={hasThink ? styles.chatItemWithThink : styles.chatItem}>
              <Text style={styles.characterName}>{chat.characterName}</Text>
              <Text style={styles.text}>{chat.content[chat.index]}</Text>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

import React from 'react';
import { View } from 'react-native';
import { TextAreaStream } from '@application/ui/textAreaStream';
import { styles } from './styles';

export type HomeScreenProps = {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
};

export function HomeScreen (params: HomeScreenProps) {
  const { prompt, setPrompt } = params;

  return (
    <View style={styles.container}>
      <TextAreaStream
        prompt={prompt}
        setPrompt={setPrompt}
      />
    </View>
  );
}

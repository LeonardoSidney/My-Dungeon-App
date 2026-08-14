import { buttonStyles, styles } from '@application/ui/textAreaStream/styles';
import { getConnectionsController, getStreamCompletionController } from '@infra/container';
import { Dispatch } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

interface TextAreaStreamProps {
  prompt: string;
  setPrompt: Dispatch<React.SetStateAction<string>>;
}

async function bolinhaDePelo (prompt: string, setPrompt: Dispatch<React.SetStateAction<string>>) {
  const connectionsController = getConnectionsController();
  const connections = await connectionsController.handle();
  if (connections.length === 0) {
    throw new Error('No connections found');
  }

  const connection = connections[0];
  const sampler = {
    id: 'default',
    name: 'default',
    systemDefault: true,
    temperature: 1,
    topP: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const streamCompletionController = getStreamCompletionController();
  const result = await streamCompletionController.handle({
    connection,
    sampler,
    modelId: '/mnt/nvme_xpg/models/Qwen3.6-35B-A3B-UD-Q5_K_S.gguf',
    prompt,
  });

  if (!result.success || !result.stream) {
    throw new Error(result.error || 'Failed to start stream completion');
  }

  let currentText = prompt;
  let lastUpdateTime = Date.now();
  const throttleInterval = 100;

  for await (const token of result.stream) {
    currentText += token;

    const now = Date.now();
    if (now - lastUpdateTime >= throttleInterval) {
      setPrompt(currentText);
      lastUpdateTime = now;
    }
  }

  setPrompt(currentText);
}

export function TextAreaStream ({ prompt, setPrompt }: TextAreaStreamProps) {
  const handleStream = async () => {
    await bolinhaDePelo(prompt, setPrompt);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={prompt}
        onChangeText={setPrompt}
        multiline
        placeholder="Enter your prompt..."
      />
      <Pressable onPress={handleStream} style={buttonStyles.stream}>
        <Text style={buttonStyles.text}>Start Stream</Text>
      </Pressable>
    </View>
  );
}

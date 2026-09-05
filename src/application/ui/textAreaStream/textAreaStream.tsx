import React, { useEffect, useRef, useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { Model } from '@domain/entities';
import { DEFAULT_SAMPLER } from '@domain/constants/sampler';
import { getConnectionsController, getModelsFromProviderController, getStreamCompletionController } from '@infra/container';
import { buttonStyles, styles } from './styles';

interface TextAreaStreamProps {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}

async function bolinhaDePelo (
  prompt: string,
  setPrompt: React.Dispatch<React.SetStateAction<string>>,
  abortRef: { current: (() => void) | null; }
) {
  const connectionsController = getConnectionsController();
  const connections = await connectionsController.handle();
  if (connections.length === 0) {
    throw new Error('No connections found');
  }

  const modelsController = getModelsFromProviderController();
  let selectedConnectionId: string | undefined;
  let selectedModelId: string | undefined;

  for (const connection of connections) {
    let loadedModel: Model | undefined;
    try {
      const modelsResponse = await modelsController.handle({ connection });
      loadedModel = modelsResponse.models?.find(model => model.loaded === true);
    } catch (error) {
      console.error(`Failed to fetch models from connection ${connection.id}:`, error);
      continue;
    }

    if (!loadedModel) {
      continue;
    }

    selectedConnectionId = connection.id;
    selectedModelId = loadedModel.id;
    break;
  }

  if (!selectedConnectionId || !selectedModelId) {
    throw new Error('No loaded model found on any connection');
  }

  const streamCompletionController = getStreamCompletionController();
  const result = await streamCompletionController.handle({
    connectionId: selectedConnectionId,
    samplerId: DEFAULT_SAMPLER.id,
    modelId: selectedModelId,
    prompt,
  });

  if (!result.success || !result.stream) {
    throw new Error(result.error || 'Failed to start stream completion');
  }

  abortRef.current = result.abort ?? null;

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
  const [isStreaming, setIsStreaming] = useState(false);
  const isRunningRef = useRef(false);
  const abortRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      abortRef.current?.();
    };
  }, []);

  const handleStreamToggle = async () => {
    if (isStreaming) {
      abortRef.current?.();
      return;
    }

    if (isRunningRef.current) {
      return;
    }

    isRunningRef.current = true;
    setIsStreaming(true);

    try {
      await bolinhaDePelo(prompt, setPrompt, abortRef);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to stream response';
      Alert.alert('Erro', message);
    } finally {
      abortRef.current = null;
      isRunningRef.current = false;
      setIsStreaming(false);
    }
  };

  const buttonLabel = isStreaming ? 'Stop Stream' : 'Start Stream';

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={prompt}
        onChangeText={setPrompt}
        editable={!isStreaming}
        multiline
        placeholder="Enter your prompt..."
      />
      <Pressable onPress={handleStreamToggle} style={buttonStyles.stream}>
        <Text style={buttonStyles.text}>{buttonLabel}</Text>
      </Pressable>
    </View>
  );
}

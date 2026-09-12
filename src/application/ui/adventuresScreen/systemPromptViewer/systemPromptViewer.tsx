import React, { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { SystemPromptViewerProps, SystemPromptViewerTab } from './constants';

export function SystemPromptViewer (params: SystemPromptViewerProps) {
  const { data, onBack } = params;
  const [activeTab, setActiveTab] = useState<SystemPromptViewerTab>('systemPrompt');

  const handleSelectTab = (tab: SystemPromptViewerTab) => {
    setActiveTab(tab);
  };

  const activeTabIsSystemPrompt = activeTab === 'systemPrompt';
  const activePrompt = activeTabIsSystemPrompt ? data.systemPrompt : data.finalPrompt;
  const activePromptError = activeTabIsSystemPrompt ? data.systemPromptError : data.finalPromptError;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{data.adventure.name}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTabIsSystemPrompt && styles.tabActive]} onPress={() => handleSelectTab('systemPrompt')}>
          <Text style={[styles.tabText, activeTabIsSystemPrompt && styles.tabTextActive]}>System prompt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, !activeTabIsSystemPrompt && styles.tabActive]} onPress={() => handleSelectTab('finalPrompt')}>
          <Text style={[styles.tabText, !activeTabIsSystemPrompt && styles.tabTextActive]}>Final (template + chat)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activePromptError && <Text style={styles.errorText}>Error: {activePromptError}</Text>}
        {!activeTabIsSystemPrompt && !activePromptError && (
          <Text style={styles.noteText}>Includes the current chat and the model template tokens.</Text>
        )}
        {activePrompt ? (
          <ScrollView>
            <Text style={styles.promptText}>{activePrompt}</Text>
          </ScrollView>
        ) : !activePromptError ? (
          <Text style={styles.noteText}>No prompt available.</Text>
        ) : null}
      </View>
    </View>
  );
}

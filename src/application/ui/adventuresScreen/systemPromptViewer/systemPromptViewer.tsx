import React, { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';
import { colors } from '../../theme';
import { SystemPromptViewerProps, SystemPromptViewerTab } from './constants';
import { usePromptQuery } from './usePromptQuery';

export function SystemPromptViewer (params: SystemPromptViewerProps) {
  const { adventureId, onBack, controllers } = params;
  const { getAdventureSummary, getAdventureSystemPrompt, getAdventureTemplatedPrompt } = controllers;
  const [activeTab, setActiveTab] = useState<SystemPromptViewerTab>('systemPrompt');
  const [adventureName, setAdventureName] = useState('');

  const systemPrompt = usePromptQuery(useCallback(() => getAdventureSystemPrompt.handle({ adventureId }), [adventureId, getAdventureSystemPrompt]));
  const templatedPrompt = usePromptQuery(useCallback(() => getAdventureTemplatedPrompt.handle({ adventureId }), [adventureId, getAdventureTemplatedPrompt]));
  const requestSystemPrompt = systemPrompt.request;
  const requestTemplatedPrompt = templatedPrompt.request;

  useEffect(() => {
    getAdventureSummary.handle({ adventureId }).then(response => {
      if (response.success && response.data) {
        setAdventureName(response.data.name);
      }
    });
  }, [adventureId, getAdventureSummary]);

  useEffect(() => {
    if (activeTab === 'systemPrompt') {
      requestSystemPrompt();
      return;
    }
    requestTemplatedPrompt();
  }, [activeTab, requestSystemPrompt, requestTemplatedPrompt]);

  const handleSelectTab = (tab: SystemPromptViewerTab) => {
    setActiveTab(tab);
  };

  const activeTabIsSystemPrompt = activeTab === 'systemPrompt';
  const active = activeTabIsSystemPrompt ? systemPrompt : templatedPrompt;
  const activePrompt = active.prompt;
  const activePromptError = active.error;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>{adventureName}</Text>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity style={[styles.tab, activeTabIsSystemPrompt && styles.tabActive]} onPress={() => handleSelectTab('systemPrompt')}>
          <Text style={[styles.tabText, activeTabIsSystemPrompt && styles.tabTextActive]}>System prompt</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, !activeTabIsSystemPrompt && styles.tabActive]} onPress={() => handleSelectTab('templatedPrompt')}>
          <Text style={[styles.tabText, !activeTabIsSystemPrompt && styles.tabTextActive]}>Final (template + chat)</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {activePromptError && <Text style={styles.errorText}>Error: {activePromptError}</Text>}
        {!activeTabIsSystemPrompt && !activePromptError && (
          <Text style={styles.noteText}>Includes the current chat and the model template tokens.</Text>
        )}
        {active.isLoading && <ActivityIndicator color={colors.text} />}
        {activePrompt ? (
          <ScrollView nestedScrollEnabled>
            <Text style={styles.promptText}>{activePrompt}</Text>
          </ScrollView>
        ) : !activePromptError && !active.isLoading ? (
          <Text style={styles.noteText}>No prompt available.</Text>
        ) : null}
      </View>
    </View>
  );
}

import React from 'react';
import { Text, View } from 'react-native';
import { styles } from './styles';

export type ScreenHeaderProps = {
  title: string;
  isWideScreen: boolean;
};

export function ScreenHeader (params: ScreenHeaderProps) {
  const { title, isWideScreen } = params;

  return (
    <View style={[styles.header, !isWideScreen && styles.headerMobile]}>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

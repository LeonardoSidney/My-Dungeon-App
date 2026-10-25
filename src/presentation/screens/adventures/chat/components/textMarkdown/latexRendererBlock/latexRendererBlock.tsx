import React from 'react';
import { Text, View } from 'react-native';
import { styles } from '../styles';

interface LatexRendererBlockProps {
    latex: string;
}

export function LatexRendererBlock ({ latex }: LatexRendererBlockProps) {
  return (
    <View style={styles.blockMath}>
      <Text style={styles.blockMathText}>{latex}</Text>
    </View>
  );
}

import React from 'react';
import { Text } from 'react-native';
import { styles } from '../styles';

interface LatexRendererInlineProps {
    latex: string;
}

export function LatexRendererInline ({ latex }: LatexRendererInlineProps) {
  return (
    <Text style={styles.inlineMath}>
      {latex}
    </Text>
  );
}

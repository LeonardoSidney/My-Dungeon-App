import React from 'react';
import 'katex/dist/katex.min.css';
import { renderLatexWeb } from '../renderLatex';
import { styles } from '../styles';

interface LatexRendererBlockWebProps {
    latex: string;
}

export function LatexRendererBlock ({ latex }: LatexRendererBlockWebProps) {
  const html = renderLatexWeb(latex, true);

  return <div dangerouslySetInnerHTML={{ __html: html }} style={styles.blockMathContainer} />;
}

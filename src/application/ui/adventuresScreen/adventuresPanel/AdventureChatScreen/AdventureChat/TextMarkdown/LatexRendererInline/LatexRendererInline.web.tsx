import React from 'react';
import 'katex/dist/katex.min.css';
import { renderLatexWeb } from '../renderLatex';
import { styles } from '../styles';

interface LatexRendererInlineWebProps {
    latex: string;
}

export function LatexRendererInline ({ latex }: LatexRendererInlineWebProps) {
  const html = renderLatexWeb(latex, false);

  return <span dangerouslySetInnerHTML={{ __html: html }} style={styles.inlineMathContainer} />;
}

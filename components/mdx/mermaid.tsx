import { renderMermaidSVG } from 'beautiful-mermaid';
import { MermaidFallback } from './mermaid-fallback';

export async function Mermaid({ chart }: { chart: string }) {
  try {
    const svg = renderMermaidSVG(chart, {
      bg: 'var(--color-fd-background)',
      fg: 'var(--color-fd-foreground)',
      interactive: true,
      transparent: true,
    });

    return <div dangerouslySetInnerHTML={{ __html: svg }} />;
  } catch {
    return <MermaidFallback chart={chart} />;
  }
}

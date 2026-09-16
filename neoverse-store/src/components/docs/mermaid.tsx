'use client';

import { useEffect, useId, useState } from 'react';
import mermaid from 'mermaid';

let initialized = false;

function ensureMermaid() {
  if (initialized) return;

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'strict',
    theme: 'base',
    themeVariables: {
      darkMode: true,
      background: '#080B12',
      primaryColor: '#121922',
      primaryTextColor: '#F1EFE8',
      primaryBorderColor: '#89A6FF',
      lineColor: '#A3ACB8',
      secondaryColor: '#19232E',
      tertiaryColor: '#0D121A',
      clusterBkg: '#0D121A',
      clusterBorder: '#526176',
      edgeLabelBackground: '#121922',
      fontFamily: 'Inter, sans-serif',
    },
  });

  initialized = true;
}

export function Mermaid({ chart }: { chart: string }) {
  const rawId = useId();
  const id = `neoverse-mermaid-${rawId.replace(/:/g, '')}`;
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    ensureMermaid();

    mermaid
      .render(id, chart)
      .then(({ svg: rendered }) => {
        if (active) setSvg(rendered);
      })
      .catch(() => {
        if (active) setFailed(true);
      });

    return () => {
      active = false;
    };
  }, [chart, id]);

  if (failed) {
    return (
      <pre className="my-6 overflow-x-auto rounded-surface border border-line bg-panel p-4 text-sm text-muted">
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return <div className="my-6 min-h-32 animate-pulse rounded-surface border border-line bg-panel" aria-label="Loading diagram" />;
  }

  return (
    <div
      className="my-6 overflow-x-auto rounded-surface border border-line bg-ink-raised p-4 [&_svg]:mx-auto [&_svg]:max-w-full"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

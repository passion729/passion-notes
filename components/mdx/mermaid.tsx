'use client';

import { use, useEffect, useId, useState } from 'react';
import { useTheme } from 'next-themes';

export function Mermaid({ chart }: { chart: string }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return;
  return <MermaidContent chart={chart} />;
}

const cache = new Map<string, Promise<unknown>>();

function cachePromise<T>(key: string, setPromise: () => Promise<T>): Promise<T> {
  const cached = cache.get(key);
  if (cached) return cached as Promise<T>;

  const promise = setPromise();
  cache.set(key, promise);
  return promise;
}

function withSafeJsonStringify<T>(task: () => Promise<T>): Promise<T> {
  const originalStringify = JSON.stringify;
  const safeStringify: typeof JSON.stringify = (value, replacer, space) => {
    const seen = new WeakSet();
    const whitelist = Array.isArray(replacer)
      ? new Set(replacer.map((entry) => String(entry)))
      : null;
    const delegate =
      typeof replacer === 'function'
        ? replacer
        : whitelist
          ? (key: string, val: unknown) => (key === '' || whitelist.has(key) ? val : undefined)
          : null;

    return originalStringify(
      value,
      (key, val) => {
        if (typeof val === 'object' && val !== null) {
          if (seen.has(val)) return '[Circular]';
          seen.add(val);
        }
        return delegate ? delegate(key, val) : val;
      },
      space,
    );
  };

  JSON.stringify = safeStringify;
  return task().finally(() => {
    JSON.stringify = originalStringify;
  });
}

function isBlockDiagram(chart: string) {
  return /^\s*block(-beta)?\b/.test(chart);
}

function MermaidContent({ chart }: { chart: string }) {
  const id = useId();
  const { resolvedTheme } = useTheme();
  const { default: mermaid } = use(cachePromise('mermaid', () => import('mermaid')));

  mermaid.initialize({
    startOnLoad: false,
    securityLevel: 'loose',
    fontFamily: 'inherit',
    themeCSS: 'margin: 1.5rem auto 0;',
    theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
  });

  const { svg, bindFunctions, error } = use(
    cachePromise(`${chart}-${resolvedTheme}`, () => {
      const renderTask = () => mermaid.render(id, chart.replaceAll('\\n', '\n'));
      const render = isBlockDiagram(chart) ? withSafeJsonStringify(renderTask) : renderTask();
      return render
        .then((result) => ({ ...result, error: null }))
        .catch((err) => ({ svg: '', bindFunctions: undefined, error: err }));
    }),
  );

  if (error) {
    const message = error instanceof Error ? error.message : String(error);
    return (
      <pre className="mermaid-error">
        Mermaid render error:
        {'\n'}
        {message}
      </pre>
    );
  }

  return (
    <div
      ref={(container) => {
        if (container) bindFunctions?.(container);
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

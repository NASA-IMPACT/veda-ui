import React, { useState, useMemo } from 'react';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import { useMDXComponents, MDXProvider } from '@mdx-js/react';
import remarkGfm from 'remark-gfm';
import { MDXContent } from 'mdx/types';

interface useMDXReturnProps {
  source: string;
  result: MDXContent | null;
  error: any;
}

export function useMDX(source) {
  const [state, setState] = useState<useMDXReturnProps>({ source, result: null, error: null });

  async function setSource(source) {
    const remarkPlugins = [remarkGfm];
    // const rehypePlugins = [rehypeSanitize];

    let result: MDXContent | null = null;

    try {
      result = (
        await evaluate(source, {
          ...runtime,
          useMDXComponents,
          useDynamicImport: true,
          remarkPlugins
        } as any)
      ).default;

      setState((oldState) => {
        return { ...oldState, source, result, error: null };
      });
    } catch (error) {
      setState((oldState) => {
        return { ...oldState, source, result: null, error };
      });
    }
  }

  useMemo(() => setSource(source), [source]);

  return {...state, setSource};
}


interface MDXEditorProps {
  initialSource: string;
  components: any;
}

const MDXEditor = ({ initialSource, components = null }: MDXEditorProps) => {
  const {source, result, error, setSource} = useMDX(initialSource);
  const onUpdate = (v) => setSource(v.target.value);

  return (
    <div>
      <textarea value={source} onChange={onUpdate} rows={20} cols={50} />
      <MDXRenderer result={result} components={components} />

      {error && (
        <>
          <h2>Error!</h2>
          {JSON.stringify(error)}
        </>
      )}
    </div>
  );
};

interface MDXRendererProps {
  result: MDXContent | null;
  components: any;
}

export const MDXRenderer = ({ result, components }: MDXRendererProps) => {
  return (
    <MDXProvider components={components}>
      {result && result({ components })}
    </MDXProvider>
  );
};

export default MDXEditor;

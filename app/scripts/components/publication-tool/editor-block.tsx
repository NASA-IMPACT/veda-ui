import React, { useEffect, useMemo, useState } from 'react';
import { evaluate } from '@mdx-js/mdx';
import { MDXContent } from 'mdx/types';
import remarkGfm from 'remark-gfm';
import * as runtime from 'react/jsx-runtime';
import { useMDXComponents } from '@mdx-js/react';
import MDXRenderer from './mdx-renderer';
import { MDXBlockWithError } from './block-with-error';


interface useMDXReturnProps {
  source: string;
  result: MDXContent | null;
  error: any;
}


const useMDX = (source: string) => {
  const remarkPlugins = [remarkGfm];
  const [state, setState] = useState<useMDXReturnProps>({
    source,
    result: null,
    error: null
  });

  async function renderMDX() {
    let result: MDXContent | null = null;
    try {
      const wrappedSource = `<Block>${source}</Block>`;
      result = (
        await evaluate(wrappedSource, {
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

  useEffect(() => {
    renderMDX();
  }, [source]);

  return state;
};

export default function EditorBlock({ mdx }: { mdx: string }) {
  const { result, error } = useMDX(mdx);
  const errorHumanReadable = useMemo(() => {
    if (!error) return null;
    const { line, message } = JSON.parse(JSON.stringify(error));
    return { message: `At line ${line - 1}: ${message}` };
  }, [error]);

  return error ? <MDXBlockWithError error={errorHumanReadable} /> : <MDXRenderer result={result} />;
}


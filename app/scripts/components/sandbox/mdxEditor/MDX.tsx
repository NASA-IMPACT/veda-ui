import React, { useState, useMemo } from 'react';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import { useMDXComponents, MDXProvider } from '@mdx-js/react';
import remarkGfm from 'remark-gfm';
import { MDXContent } from 'mdx/types';
import CodeMirror from 'rodemirror';
import { basicSetup } from 'codemirror';
import { markdown as langMarkdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';
import styled from 'styled-components';
import Draggable from 'react-draggable';

const DraggableEditor = styled.div`
  position: absolute;
  width: 800px;
  max-height: 500px;
  overflow: scroll;
  z-index: 99;
`;


const TitleBar = styled.div`
  background-color: #1e1e1e;
  color: #fff;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  border-bottom: 1px solid #000;
  cursor: move;
`;
interface useMDXReturnProps {
  source: string;
  result: MDXContent | null;
  error: any;
}

function useMDX(source) {
  const [state, setState] = useState<useMDXReturnProps>({
    source,
    result: null,
    error: null
  });

  async function setSource(source) {
    const remarkPlugins = [remarkGfm];

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

  return { ...state, setSource };
}

interface MDXEditorProps {
  initialSource: string;
  components: any;
}

const MDXEditor = ({ initialSource, components = null }: MDXEditorProps) => {
  const { result, error, setSource } = useMDX(initialSource);

  const extensions = useMemo<Extension[]>(
    () => [basicSetup, oneDark, langMarkdown()],
    []
  );

  return (
    <div>
      <Draggable handle='.titleBar'>
        <DraggableEditor>
          <TitleBar className='titleBar'>MDX Editor</TitleBar>
          <CodeMirror
            value={initialSource}
            onUpdate={(v) => {
              if (v.docChanged) {
                setSource(v.state.doc.toString());
              }
            }}
            extensions={extensions}
          />
          {error && (
            <>
              <h2>Error!</h2>
              {JSON.stringify(error)}
            </>
          )}
        </DraggableEditor>
      </Draggable>
      <MDXRenderer result={result} components={components} />
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

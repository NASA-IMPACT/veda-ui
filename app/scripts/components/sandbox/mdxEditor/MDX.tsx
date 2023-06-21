import React, { useState, useMemo, createContext, useContext } from 'react';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import { useMDXComponents, MDXProvider } from '@mdx-js/react';
import remarkGfm from 'remark-gfm';
import { MDXContent } from 'mdx/types';
import { ErrorBoundary } from 'react-error-boundary';
import CodeMirror from 'rodemirror';
import { basicSetup } from 'codemirror';
import { markdown as langMarkdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { generalErrorMessage } from '../../common/blocks/block-constant';
import { BlockComponent } from '$components/common/blocks';
import { HintedErrorDisplay, docsMessage } from '$utils/hinted-error';

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

const MDXContext = createContext<MDXContent | null>(null);

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
      <MDXContext.Provider value={result}>
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
      </MDXContext.Provider>
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

const MDXBlockError = ({ error }: any) => {
  return (
    <HintedErrorDisplay
      title={generalErrorMessage}
      subtitle={docsMessage}
      message={error.message}
      hints={error.hints}
    />
  );
};

class ErrorBoundaryWithCRAReset extends ErrorBoundary {
  static getDerivedStateFromError(error: Error) {
    (error as any).CRAOverlayIgnore = true;
    return { didCatch: true, error };
  }
}

export const MDXBlockWithError = (props) => {
  const result = useContext(MDXContext);
  return (
    <ErrorBoundaryWithCRAReset FallbackComponent={MDXBlockError} resetKeys={[result]}>
      <BlockComponent {...props} />
    </ErrorBoundaryWithCRAReset>
  );
};

export default MDXEditor;

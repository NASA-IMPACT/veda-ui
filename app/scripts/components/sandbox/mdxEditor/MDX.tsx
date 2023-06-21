import React, { useState, useMemo, createContext, useContext } from 'react';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import { useMDXComponents, MDXProvider } from '@mdx-js/react';
import remarkGfm from 'remark-gfm';
import { MDXContent } from 'mdx/types';
import { ErrorBoundary } from 'react-error-boundary';
import useLocalStorage from "use-local-storage";
import CodeMirror from 'rodemirror';
import { basicSetup } from 'codemirror';
import { markdown as langMarkdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { themeVal } from '@devseed-ui/theme-provider';
import { generalErrorMessage } from '../../common/blocks/block-constant';
import { BlockComponent } from '$components/common/blocks';
import { HintedErrorDisplay, docsMessage } from '$utils/hinted-error';
import { MDX_LOCAL_STORAGE_KEY, MDX_SOURCE_DEFAULT } from '.';

const DraggableEditor = styled.div`
  position: absolute;
  width: 800px;
  z-index: 999;
  right: 10px;
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

const ErrorBar = styled.div`
  background-color: #fff;
  border: 3px solid ${themeVal('color.danger')};
  color:  ${themeVal('color.danger')};
  padding: 4px;
`;

const EditorWrapper = styled.div`
  overflow: scroll;
  max-height: 500px;
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
      // console.log(error)
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
  const [, setmMdxSource] = useLocalStorage(MDX_LOCAL_STORAGE_KEY, MDX_SOURCE_DEFAULT);

  const extensions = useMemo<Extension[]>(
    () => [basicSetup, oneDark, langMarkdown()],
    []
  );

  const errorHumanReadable = useMemo(() => {
    if (!error) return null;
    const { line, message } = JSON.parse(JSON.stringify(error));
    return `At line ${line  - 1}: ${message}`;
  }, [error]);
      

  return (
    <div>
      <MDXContext.Provider value={result}>
        <Draggable handle='.titleBar'>
          <DraggableEditor>
            <TitleBar className='titleBar'>MDX Editor</TitleBar>
            {error && (
              <ErrorBar>
                {errorHumanReadable}
              </ErrorBar>
              )}
            <EditorWrapper>
              <CodeMirror
                value={initialSource}
                onUpdate={(v) => {
                  if (v.docChanged) {
                    setSource(v.state.doc.toString());
                    setmMdxSource(v.state.doc.toString());
                  }
                }}
                extensions={extensions}
              />
            </EditorWrapper>
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
    <ErrorBoundaryWithCRAReset
      FallbackComponent={MDXBlockError}
      resetKeys={[result]}
    >
      <BlockComponent {...props} />
    </ErrorBoundaryWithCRAReset>
  );
};

export default MDXEditor;

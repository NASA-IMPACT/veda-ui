import React, {
  useState,
  useMemo,
  createContext,
  useContext,
  useCallback,
  useEffect
} from 'react';
import * as runtime from 'react/jsx-runtime';
import { evaluate } from '@mdx-js/mdx';
import { useMDXComponents, MDXProvider } from '@mdx-js/react';
import remarkGfm from 'remark-gfm';
import { MDXContent } from 'mdx/types';
import { ErrorBoundary } from 'react-error-boundary';
import CodeMirror from 'rodemirror';
import { EditorView, basicSetup } from 'codemirror';
import { markdown as langMarkdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import { themeVal } from '@devseed-ui/theme-provider';
import { generalErrorMessage } from '../../common/blocks/block-constant';
import { MDX_LOCAL_STORAGE_KEY, MDX_SOURCE_DEFAULT } from '.';
import { BlockComponent } from '$components/common/blocks';
import { HintedErrorDisplay, docsMessage } from '$utils/hinted-error';

const DEFAULT_CONTENT = '(your content here)';

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

const ResetButton = styled.button`
  opacity: 0.5;
  background-color: transparent;
  text-decoration: underline;
  color: #fff;
  border: none;
  font-size: 10px;
  font-weight: normal;
  cursor: pointer;
`;

const ErrorBar = styled.div`
  background-color: #fff;
  border: 3px solid ${themeVal('color.danger')};
  color: ${themeVal('color.danger')};
  padding: 4px;
`;

const EditorWrapper = styled.div`
  overflow: scroll;
  max-height: 500px;
`;

const GlobalErrorWrapper = styled.div`
  border: 3px solid ${themeVal('color.danger')};
  color: ${themeVal('color.danger')};
  font-size: 14px;
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

  useEffect(() => {
    localStorage.setItem(MDX_LOCAL_STORAGE_KEY, state.source);
  }, [state.source]);

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

  const extensions = useMemo<Extension[]>(
    () => [basicSetup, oneDark, langMarkdown()],
    []
  );

  const errorHumanReadable = useMemo(() => {
    if (!error) return null;
    const { line, message } = JSON.parse(JSON.stringify(error));
    return `At line ${line - 1}: ${message}`;
  }, [error]);

  const [editorView, setEditorView] = useState<EditorView | null>(null);

  const writeToEditor = useCallback(
    (source) => {
      if (!editorView) return;
      editorView.dispatch({
        changes: {
          from: 0,
          to: editorView.state.doc.length,
          insert: source
        }
      });
    },
    [editorView]
  );

  return (
    <ErrorBoundaryWithCRAReset FallbackComponent={GlobalError}>
      <MDXContext.Provider value={result}>
        <Draggable handle='.titleBar'>
          <DraggableEditor>
            <TitleBar className='titleBar'>
              MDX Editor{' '}
              <ResetButton
                type='button'
                onClick={() => {
                  writeToEditor(MDX_SOURCE_DEFAULT);
                  setSource(MDX_SOURCE_DEFAULT);
                }}
              >
                reset with default content
              </ResetButton>
              <ResetButton
                type='button'
                onClick={() => {
                  writeToEditor(DEFAULT_CONTENT);
                  setSource(DEFAULT_CONTENT);
                }}
              >
                clear
              </ResetButton>
            </TitleBar>
            {error && <ErrorBar>{errorHumanReadable}</ErrorBar>}
            <EditorWrapper>
              <CodeMirror
                value={initialSource}
                onEditorViewChange={(editorView) => setEditorView(editorView)}
                onUpdate={(v) => {
                  if (v.docChanged) {
                    let source = v.state.doc.toString();

                    // This is a hack to prevent the editor from being cleared
                    // when the user deletes all the text.
                    // because when that happens, React throws an order of hooks error
                    source = source ? source : DEFAULT_CONTENT;
                    setSource(source);
                  }
                }}
                extensions={extensions}
              />
            </EditorWrapper>
          </DraggableEditor>
        </Draggable>
        <MDXRenderer result={result} components={components} />
      </MDXContext.Provider>
    </ErrorBoundaryWithCRAReset>
  );
};

class ErrorBoundaryWithCRAReset extends ErrorBoundary {
  static getDerivedStateFromError(error: Error) {
    (error as any).CRAOverlayIgnore = true;
    return { didCatch: true, error };
  }
}

interface MDXRendererProps {
  result: MDXContent | null;
  components: any;
}

const MDXRenderer = ({ result, components }: MDXRendererProps) => {
  return (
    <MDXProvider components={components}>
      {result && result({ components })}
    </MDXProvider>
  );
};

const GlobalError = () => {
  return (
    <GlobalErrorWrapper>
      An error occurred
      <div>
        <button
          type='button'
          onClick={() => {
            window.location.reload();
          }}
        >
          Try again with recovered content
        </button>
        <button
          type='button'
          onClick={() => {
            window.localStorage.setItem(
              MDX_LOCAL_STORAGE_KEY,
              MDX_SOURCE_DEFAULT
            );
            window.location.reload();
          }}
        >
          Try again with content reset to defaults
        </button>
      </div>
    </GlobalErrorWrapper>
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

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import CodeMirror from 'rodemirror';
import { EditorView, basicSetup } from 'codemirror';
import { oneDark } from '@codemirror/theme-one-dark';
import { Extension } from '@codemirror/state';
import { markdown as langMarkdown } from '@codemirror/lang-markdown';
import { useCurrentBlockId, useCurrentDataStory, useSetBlockMDX } from './atoms';

const DEFAULT_CONTENT = '(your content here)';

const EditorWrapper = styled.div`
  margin: 0 3rem 1rem;
`;

const CodeMirrorWrapper = styled.div`
  overflow: scroll;
  max-height: 500px;
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

export default function Editor() {
  const extensions = useMemo<Extension[]>(
    () => [basicSetup, oneDark, langMarkdown()],
    []
  );

  const [editorView, setEditorView] = useState<EditorView | null>(null);
  const currentDataStory = useCurrentDataStory();

  // Update editor on current editing change
  useEffect(() => {
    if (!editorView) return;
    const currentBlock = currentDataStory?.blocks.find(
      (block) => block.id === currentDataStory?.currentBlockId
    );
    editorView.dispatch({
      changes: {
        from: 0,
        to: editorView.state.doc.length,
        insert: currentBlock?.mdx
      }
    });
  }, [editorView, currentDataStory?.currentBlockId]);

  const currentBlockId = useCurrentBlockId();
  const setMDX = useSetBlockMDX(currentBlockId!);
  const onEditorUpdated = useCallback(
    (v) => {
      if (v.docChanged) {
        let blockSource = v.state.doc.toString();
        // This is a hack to prevent the editor from being cleared
        // when the user deletes all the text.
        // because when that happens, React throws an order of hooks error
        blockSource = blockSource || DEFAULT_CONTENT;

        
        if (setMDX) setMDX(blockSource);
        // const allSource = [
        //   ...source.slice(0, currentEditingBlockIndexRef.current),
        //   blockSource,
        //   ...source.slice(currentEditingBlockIndexRef.current + 1)
        // ];
        // setSource(allSource);
      }
    },
    [setMDX]
  );

  return (
    <EditorWrapper>
      <TitleBar className='titleBar'>MDX Editor</TitleBar>

      <CodeMirrorWrapper>
        <CodeMirror
          // value={initialSource.join('\n')}
          onEditorViewChange={(editorView) => setEditorView(editorView)}
          onUpdate={onEditorUpdated}
          extensions={extensions}
        />
      </CodeMirrorWrapper>
    </EditorWrapper>
  );
}

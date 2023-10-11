import React, { useEffect, useMemo, useState } from 'react';
import { evaluate } from '@mdx-js/mdx';
import { themeVal } from '@devseed-ui/theme-provider';
import { Button, ButtonGroup } from '@devseed-ui/button';
import styled from 'styled-components';
import { MDXContent } from 'mdx/types';
import remarkGfm from 'remark-gfm';
import * as runtime from 'react/jsx-runtime';
import { useMDXComponents } from '@mdx-js/react';
import MDXRenderer from './mdx-renderer';
import { MDXBlockWithError } from './block-with-error';
import {
  useAddBlock,
  useCurrentDataStory,
  useRemoveBlock,
  useSetBlockOrder,
  useSetCurrentBlockId
} from './atoms';

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

const MDXRendererControls = styled.div<{ highlighted: boolean, editing: boolean }>`
  background: ${(props) =>
    props.editing
      ? `repeating-linear-gradient(
    45deg,
    transparent,
    transparent 10px,
    #eee 10px,
    #eee 20px
  )`
      : 'transparent'};
  position: relative;
  border-color: ${(props) => (props.highlighted ? themeVal('color.base') : 'transparent')};
  border-width: 2px;
  border-style: solid;
`;

const MDXRendererActions = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  padding: 1rem;
`;

export default function EditorBlock({
  mdx,
  id,
  onHighlight,
  highlighted
}: {
  mdx: string;
  id: string;
  onHighlight: (id: string) => void;
  highlighted: boolean;
}) {
  const { result, error } = useMDX(mdx);
  const errorHumanReadable = useMemo(() => {
    if (!error) return null;
    const { line, message } = JSON.parse(JSON.stringify(error));
    return { message: `At line ${line - 1}: ${message}` };
  }, [error]);

  const onEditClick = useSetCurrentBlockId(id);
  const onRemoveClick = useRemoveBlock(id);
  const onAddClick = useAddBlock(id);
  const { isAvailable: canGoUp, setBlockOrder: onUpClick } = useSetBlockOrder(
    id,
    'up'
  );
  const { isAvailable: canGoDown, setBlockOrder: onDownClick } =
    useSetBlockOrder(id, 'down');

  const currentDataStory = useCurrentDataStory();

  const editing = id === currentDataStory?.currentBlockId;

  return error ? (
    <MDXBlockWithError error={errorHumanReadable} />
  ) : (
    <MDXRendererControls
      highlighted={highlighted}
      editing={editing}
      onMouseOver={() => onHighlight(id)}
    >
      <MDXRenderer result={result} />
      {highlighted && (
        <MDXRendererActions>
          <ButtonGroup>
            <Button onClick={onEditClick} disabled={editing}>
              {editing ? 'Editing' : 'Edit MDX'}
            </Button>
            <Button onClick={onRemoveClick}>Remove</Button>
            <Button onClick={onUpClick} disabled={!canGoUp}>
              Move up
            </Button>
            <Button onClick={onDownClick} disabled={!canGoDown}>
              Move down
            </Button>
            <Button onClick={onAddClick}>Add new...</Button>
          </ButtonGroup>
        </MDXRendererActions>
      )}
      <div id={`block${id}`} />
    </MDXRendererControls>
  );
}

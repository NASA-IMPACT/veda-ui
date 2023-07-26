import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import EditorBlock from './editor-block';
import { useCurrentDataStory } from './atoms';
import Editor from './editor';
import { PageMainContent } from '$styles/page';

export default function DataStoryEditor() {
  const currentDataStory = useCurrentDataStory();
  const [currentHighlightedBlockId, setCurrentHighlightedBlockId] =
    useState<string>();

  return (
    <>
      {currentDataStory?.currentBlockId &&
        document.getElementById(`block${currentDataStory?.currentBlockId}`) &&
        createPortal(
          <Editor />,
          document.getElementById(
            `block${currentDataStory?.currentBlockId}`
          ) as HTMLElement
        )}
      <PageMainContent>
        <article>
          {currentDataStory?.blocks.map((block) => {
            return (
              <EditorBlock
                key={block.id}
                id={block.id}
                mdx={block.mdx}
                onHighlight={setCurrentHighlightedBlockId}
                highlighted={currentHighlightedBlockId === block.id}
              />
            );
          })}
        </article>
      </PageMainContent>
    </>
  );
}

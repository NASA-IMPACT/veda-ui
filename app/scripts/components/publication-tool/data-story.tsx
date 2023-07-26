import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAtom } from 'jotai';
import { useParams } from 'react-router';
import EditorBlock from './editor-block';
import { DataStoriesAtom } from '.';
import { PageMainContent } from '$styles/page';

export default function DataStoryEditor() {
  const { storyId } = useParams();
  const [dataStories, setDataStories] = useAtom(DataStoriesAtom);
  const story = dataStories.find((s) => s.frontmatter.id === storyId);
  const [currentHighlightedBlockId, setCurrentHighlightedBlockId] =
    useState<string>();

  return (
    <>
      {story?.currentBlockId &&
        document.getElementById(`block${story?.currentBlockId}`) &&
        createPortal(
          <div>Insert editor here</div>,
          document.getElementById(
            `block${story?.currentBlockId}`
          ) as HTMLElement
        )}
      <PageMainContent>
        <article>
          {story?.blocks.map((block) => {
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

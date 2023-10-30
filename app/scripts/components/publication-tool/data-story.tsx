import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { ErrorBoundary } from 'react-error-boundary';
import EditorBlock from './editor-block';
import { useCurrentDataStory } from './atoms';
import Editor from './editor';
import { PageMainContent } from '$styles/page';

class ErrorBoundaryWithCRAReset extends ErrorBoundary {
  static getDerivedStateFromError(error: Error) {
    (error as any).CRAOverlayIgnore = true;
    return { didCatch: true, error };
  }
}

const GlobalError = () => {
  return <div>Something went wrong</div>;
};

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
        <ErrorBoundaryWithCRAReset FallbackComponent={GlobalError}>
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
        </ErrorBoundaryWithCRAReset>
      </PageMainContent>
    </>
  );
}

import React from 'react';
import { useAtom } from 'jotai';
import { useParams } from 'react-router';
import EditorBlock from './editor-block';
import { DataStoriesAtom } from '.';
import { PageMainContent } from '$styles/page';

export default function DataStoryEditor() {
  const { pId } = useParams();
  const [dataStories, setDataStories] = useAtom(DataStoriesAtom);
  const story = dataStories.find((s) => s.frontmatter.id === pId);

  return (
    <PageMainContent>
      <article>
        {story?.blocks.map((block) => {
          return (
            <EditorBlock key={block.mdx} mdx={block.mdx} />
          );
        })}
      </article>
    </PageMainContent>
  );
}

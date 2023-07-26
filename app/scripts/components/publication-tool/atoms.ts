import { atomWithStorage } from 'jotai/utils';
import { useParams } from 'react-router';
import { useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import { DataStory } from './types';

export const DataStoriesAtom = atomWithStorage<DataStory[]>('dataStories', [
  {
    frontmatter: {
      id: 'example-data-story',
      name: 'Example Data Story',
      description: 'This is an example data story',
      sources: [],
      thematics: [],
      pubDate: '2023-01-01'
    },
    currentBlockId: '1',
    blocks: [
      {
        id: '1',
        tag: 'Block',
        mdx: `
          <Prose>
          ### Your markdown header
      
          Your markdown contents comes here.

          <Map
          datasetId='no2'
          layerId='no2-monthly'
          center={[120.11, 34.95]}
          zoom={4.5}
          dateTime='2020-02-01'
          compareDateTime='2022-02-01'
        />
        <Caption 
          attrAuthor='NASA' 
          attrUrl='https://nasa.gov/'
        >
          Levels in 10¹⁵ molecules cm⁻². Darker colors indicate higher nitrogen dioxide (NO₂) levels associated and more activity. Lighter colors indicate lower levels of NO₂ and less activity.
        </Caption> 
        </Prose>`
      },
      {
        id: '2',
        tag: 'Block',
        mdx: `
          <Prose>
          ### Second header
      
          Let's tell a story of _data_.
          
        </Prose>`
      }
    ]
  },
  {
    frontmatter: {
      id: 'example-data-story-2',
      name: 'Example Data Story 2',
      description: 'This is an example data story',
      sources: [],
      thematics: [],
      pubDate: '2023-01-01'
    },
    blocks: [
      {
        id: '1',
        tag: 'Block',
        mdx: `
          <Prose>
          ### Your markdown header
      
          Your markdown contents comes here.
        </Prose>`
      }
    ]
  }
]);

export const useCurrentDataStory = () => {
  const { storyId } = useParams();
  const dataStories = useAtomValue(DataStoriesAtom);
  const currentDataStory = useMemo(
    () => dataStories.find((p) => p.frontmatter.id === storyId),
    [dataStories, storyId]
  );
  return currentDataStory;
};

export const useCurrentBlockId = () => {
  const currentDataStory = useCurrentDataStory();
  const currentBlockId = currentDataStory?.currentBlockId;
  return currentBlockId;
};

export const useSetCurrentBlock = (blockId: string) => {
  const { storyId } = useParams();
  const setDataStories = useSetAtom(DataStoriesAtom);
  return useCallback(() => {
    setDataStories((oldDataStories) => {
      const newDataStories = [...oldDataStories];
      const storyIndex = newDataStories.findIndex(
        (s) => s.frontmatter.id === storyId
      );
      newDataStories[storyIndex].currentBlockId = blockId;
      return newDataStories;
    });
  }, [blockId, setDataStories, storyId]);
};

export const useSetBlockMDX = (blockId?: string) => {
  const { storyId } = useParams();
  const setDataStories = useSetAtom(DataStoriesAtom);
  const callback = useCallback(
    (mdx: string) => {
      setDataStories((oldDataStories) => {
        const newDataStories = [...oldDataStories];
        const storyIndex = newDataStories.findIndex(
          (s) => s.frontmatter.id === storyId
        );
        const blockIndex = newDataStories[storyIndex].blocks.findIndex(
          (b) => b.id === blockId
        );
        newDataStories[storyIndex].blocks[blockIndex].mdx = mdx;
        return newDataStories;
      });
    },
    [blockId, setDataStories, storyId]
  );
  return blockId ? callback : undefined;
};

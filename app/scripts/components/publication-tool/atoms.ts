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

export const useStoryIndex = () => {
  const { storyId } = useParams();
  const dataStories = useAtomValue(DataStoriesAtom);
  const storyIndex = useMemo(
    () => dataStories.findIndex((p) => p.frontmatter.id === storyId),
    [dataStories, storyId]
  );
  return storyIndex;
};

export const useBlockIndex = (blockId: string) => {
  const currentDataStory = useCurrentDataStory();
  const blockIndex = useMemo(() => {
    const blockIndex = currentDataStory?.blocks.findIndex(
      (b) => b.id === blockId
    );
    return blockIndex ?? -1;
  }, [blockId, currentDataStory]);
  return blockIndex;
};

const useCRUDUtils = (blockId: string) => {
  const setDataStories = useSetAtom(DataStoriesAtom);
  const storyIndex = useStoryIndex();
  const blockIndex = useBlockIndex(blockId);
  return { setDataStories, storyIndex, blockIndex };
};

export const useSetCurrentBlockId = (blockId: string) => {
  const { setDataStories, storyIndex } = useCRUDUtils(blockId);
  return useCallback(() => {
    setDataStories((oldDataStories) => {
      const newDataStories = [...oldDataStories];
      newDataStories[storyIndex].currentBlockId = blockId;
      return newDataStories;
    });
  }, [blockId, setDataStories, storyIndex]);
};

export const useRemoveBlock = (blockId: string) => {
  const { setDataStories, storyIndex, blockIndex } = useCRUDUtils(blockId);
  return useCallback(() => {
    if (window.confirm('Are you sure you want to delete this block?')) {
      setDataStories((oldDataStories) => {
        const newDataStories = [...oldDataStories];
        newDataStories[storyIndex].blocks = [
          ...newDataStories[storyIndex].blocks.slice(0, blockIndex),
          ...newDataStories[storyIndex].blocks.slice(blockIndex + 1)
        ];
        return newDataStories;
      });
    }
  }, [setDataStories, storyIndex, blockIndex]);
};

export const useAddBlock = (afterBlockId: string) => {
  const { setDataStories, storyIndex, blockIndex } = useCRUDUtils(afterBlockId);
  return useCallback(() => {
    setDataStories((oldDataStories) => {
      const newDataStories = [...oldDataStories];
      const newBlockId = new Date().getTime().toString();
      newDataStories[storyIndex].currentBlockId = newBlockId;
      newDataStories[storyIndex].blocks = [
        ...newDataStories[storyIndex].blocks.slice(0, blockIndex + 1),
        {
          id: newBlockId,
          tag: 'Block',
          mdx: `<Prose>
### Hello, new block!
      
Let's tell a story of _data_.
          
</Prose>`
        },
        ...newDataStories[storyIndex].blocks.slice(blockIndex + 1)
      ];
      return newDataStories;
    });
  }, [setDataStories, storyIndex, blockIndex]);
};

export const useSetBlockMDX = (blockId: string) => {
  const { setDataStories, storyIndex, blockIndex } = useCRUDUtils(blockId);
  const callback = useCallback(
    (mdx: string) => {
      setDataStories((oldDataStories) => {
        const newDataStories = [...oldDataStories];
        newDataStories[storyIndex].blocks[blockIndex].mdx = mdx;
        return newDataStories;
      });
    },
    [setDataStories, storyIndex, blockIndex]
  );
  return blockId ? callback : undefined;
};

export const useSetBlockOrder = (blockId: string, direction: 'up' | 'down') => {
  const { setDataStories, storyIndex, blockIndex } = useCRUDUtils(blockId);
  const currentDataStory = useCurrentDataStory();

  const isAvailable = useMemo(() => {
    const canGoUp = blockIndex > 0;
    const canGoDown = currentDataStory
      ? blockIndex < currentDataStory.blocks.length - 1
      : false;
    return direction === 'up' ? canGoUp : canGoDown;
  }, [blockIndex, currentDataStory, direction]);

    
  const setBlockOrder = useCallback(() => {
    setDataStories((oldDataStories) => {
      const newDataStories = [...oldDataStories];
      const block = newDataStories[storyIndex].blocks[blockIndex];
      // const newBlockIndex =
      //   direction === 'up' ? blockIndex - 1 : blockIndex + 1;
      // newDataStories[storyIndex].blocks = [
      //   ...newDataStories[storyIndex].blocks.slice(0, blockIndex),
      //   ...newDataStories[storyIndex].blocks.slice(blockIndex + 1)
      // ];

      if (direction === 'up') {
        newDataStories[storyIndex].blocks[blockIndex] =
          newDataStories[storyIndex].blocks[blockIndex - 1];
        newDataStories[storyIndex].blocks[blockIndex - 1] = block;
      } else {
        newDataStories[storyIndex].blocks[blockIndex] =
          newDataStories[storyIndex].blocks[blockIndex + 1];
        newDataStories[storyIndex].blocks[blockIndex + 1] = block;
      }
      return newDataStories;
    });
  }, [setDataStories, storyIndex, blockIndex, direction]);
  return { isAvailable, setBlockOrder };
};

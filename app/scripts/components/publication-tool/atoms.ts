import { atomWithStorage } from 'jotai/utils';
import { useParams } from 'react-router';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo } from 'react';
import {  EditorStory } from './types';
import { toEditorDataStory, toMDXDocument } from './utils';

const DEFAULT_STORY: EditorStory = {
  frontmatter: {
    id: 'example-data-story',
    name: 'Example Data Story',
    description: 'This is an example data story',
    pubDate: '2023-01-01',
    taxonomy: []
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
};

export const DEFAULT_STORY_STRING = toMDXDocument(DEFAULT_STORY);

export const DataStoriesAtom = atomWithStorage<EditorStory[]>(
  'dataStories',
  [
    DEFAULT_STORY,
    {
      frontmatter: {
        id: 'example-data-story-2',
        name: 'Example Data Story 2',
        description: 'This is an example data story',
        taxonomy: [],
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
  ]
);

export const useCreateEditorDataStoryFromMDXDocument = () => {
  const [dataStories, setDataStories] = useAtom(DataStoriesAtom);
  return useCallback(
    (mdxDocument: string) => {
      let editorDataStory;
      try {
        editorDataStory = toEditorDataStory(mdxDocument);
        const { frontmatter } = editorDataStory;
        if (!frontmatter.id) {
          throw new Error('id is required');
        }
        if (dataStories.map((p) => p.frontmatter.id).includes(frontmatter.id)) {
          throw new Error(`id ${frontmatter.id} already exists`);
        }
      } catch (error) {
        return { id: null, error };
      }

      setDataStories((oldDataStories) => {
        const newDataStories = [...oldDataStories, editorDataStory];
        return newDataStories;
      });
      return { id: editorDataStory.frontmatter.id, error: null };
    },
    [setDataStories, dataStories]
  );
};

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
  const blockIndex = currentDataStory?.blocks.findIndex(
    (b) => b.id === blockId
  );
  return blockIndex ?? -1;
};

const useCRUDUtils = (blockId: string) => {
  const setDataStories = useSetAtom(DataStoriesAtom);
  const storyIndex = useStoryIndex();
  const blockIndex = useBlockIndex(blockId);
  const currentStory = useCurrentDataStory();
  return { setDataStories, storyIndex, currentStory, blockIndex };
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
  const { setDataStories, storyIndex, blockIndex, currentStory } = useCRUDUtils(blockId);
  const isAvailable = useMemo(() => currentStory?.blocks && currentStory.blocks.length > 1, [currentStory?.blocks]);
  const remove = useCallback(() => {
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
  return { isAvailable, remove };
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

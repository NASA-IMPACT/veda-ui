import React, { useMemo } from 'react';
import { Route, Routes, useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { Button, ButtonGroup } from '@devseed-ui/button';
import { DataStory } from './types';
import DataStoryEditor from './data-story';
import { LayoutProps } from '$components/common/layout-root';
import { resourceNotFound } from '$components/uhoh';
import PageHero from '$components/common/page-hero';
import { LocalMenu } from '$components/common/page-local-nav';
import {
  Fold,
  FoldHeader,
  FoldProse,
  FoldTitle
} from '$components/common/fold';
import { PageMainContent } from '$styles/page';

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
    blocks: [
      {
        tag: 'Block',
        mdx: `
          <<Prose>
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
        tag: 'Block',
        mdx: `
          <Prose />
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

function DataStoryEditorLayout() {
  const { pId } = useParams();
  const dataStories = useAtomValue(DataStoriesAtom);

  const page = dataStories.find((p) => p.frontmatter.id === pId);
  if (!page) throw resourceNotFound();

  const items = useMemo(
    () =>
      dataStories.map((dataStory) => ({
        id: dataStory.frontmatter.id,
        name: dataStory.frontmatter.name,
        to: `/publication-tool/${dataStory.frontmatter.id}`
      })),
    [dataStories]
  );

  return (
    <>
      <LayoutProps
        title={`Editing: ${page.frontmatter.name}`}
        localNavProps={{
          parentName: 'Publication Tool',
          parentLabel: 'Publication Tool',
          parentTo: '/publication-tool',
          items,
          currentId: pId,
          localMenuCmp: (
            <LocalMenu
              options={[
                {
                  label: 'Editor',
                  to: `/publication-tool/${page.frontmatter.id}`
                },
                {
                  label: 'Metadata',
                  to: `/publication-tool/${page.frontmatter.id}/metadata`
                },
                {
                  label: 'Export',
                  to: `/publication-tool/${page.frontmatter.id}/export`
                }
              ]}
            />
          )
        }}
      />

      <PageMainContent>
        <PageHero title={page.frontmatter.name} />
        <DataStoryEditor />
      </PageMainContent>
    </>
  );
}

function PublicationTool() {
  const dataStories = useAtomValue(DataStoriesAtom);
  return (
    <Routes>
      <Route path=':pId' element={<DataStoryEditorLayout />} />
      <Route
        index
        element={
          <PageMainContent>
            <LayoutProps title='Publication Tool' />
            <PageHero title='Publication Tool' />
            <Fold>
              <FoldHeader>
                <FoldTitle>Data Stories</FoldTitle>
              </FoldHeader>
              <FoldProse>
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataStories.map((dataStory) => (
                      <tr key={dataStory.frontmatter.id}>
                        <td>{dataStory.frontmatter.name}</td>
                        <td>
                          <ButtonGroup>
                            <Button
                              forwardedAs='a'
                              href={`/publication-tool/${dataStory.frontmatter.id}`}
                            >
                              Edit
                            </Button>
                            <Button>Delete</Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </FoldProse>
            </Fold>
          </PageMainContent>
        }
      />
    </Routes>
  );
}

export default PublicationTool;

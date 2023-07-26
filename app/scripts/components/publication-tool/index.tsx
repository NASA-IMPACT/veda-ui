import React, { useMemo } from 'react';
import { Route, Routes, useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { Button, ButtonGroup } from '@devseed-ui/button';
import DataStoryEditor from './data-story';
import { DataStoriesAtom } from './atoms';
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

function DataStoryEditorLayout() {
  const { storyId } = useParams();
  const dataStories = useAtomValue(DataStoriesAtom);

  const page = dataStories.find((p) => p.frontmatter.id === storyId);
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
          currentId: storyId,
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
      <Route path=':storyId' element={<DataStoryEditorLayout />} />
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

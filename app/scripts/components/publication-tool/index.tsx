import React, { useCallback, useMemo, useState } from 'react';
import { Route, Routes, useNavigate, useParams } from 'react-router';
import { useAtomValue } from 'jotai';
import { Button, ButtonGroup } from '@devseed-ui/button';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import DataStoryEditor from './data-story';
import {
  DEFAULT_STORY_STRING,
  DataStoriesAtom,
  useCreateEditorDataStoryFromMDXDocument
} from './atoms';
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

const Error = styled.div`
  color: ${themeVal('color.danger')};
`;

function PublicationTool() {
  const dataStories = useAtomValue(DataStoriesAtom);
  const [newStory, setNewStory] = useState<string>(DEFAULT_STORY_STRING);
  const [error, setError] = useState<string>('');
  const createEditorDataStoryFromMDXDocument =
    useCreateEditorDataStoryFromMDXDocument();
  const navigate = useNavigate();

  const onCreate = useCallback(() => {
    const { id, error } = createEditorDataStoryFromMDXDocument(newStory);
    if (error) {
      setError(error.message);
      return;
    }
    setNewStory('');
    setError('');
    navigate(`/publication-tool/${id}`);
  }, [createEditorDataStoryFromMDXDocument, newStory, navigate]);

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
                <hr />
                <h2>Create new Story</h2>
                <div>
                  <p>From existing MDX document:</p>
                  <textarea
                    rows={20}
                    onChange={(e) => setNewStory(e.currentTarget.value)}
                    placeholder='Paste full MDX document here (including frontmatter)'
                    value={newStory}
                  />
                </div>
                <Button
                  disabled={!newStory || newStory === ''}
                  onClick={onCreate}
                  variation='primary-fill'
                >
                  Create
                </Button>
                {error && <Error>Error: {error}</Error>}
              </FoldProse>
            </Fold>
          </PageMainContent>
        }
      />
    </Routes>
  );
}

export default PublicationTool;

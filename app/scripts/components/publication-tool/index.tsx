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
  useCreateEditorDataStoryFromMDXDocument,
  useDeleteDataStory
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

export const PUBLICATION_EDITOR_SLUG = '/story-editor';

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
        to: `${PUBLICATION_EDITOR_SLUG}/${dataStory.frontmatter.id}`
      })),
    [dataStories]
  );

  return (
    <>
      <LayoutProps
        title={`Editing: ${page.frontmatter.name}`}
        localNavProps={{
          parentName: 'Story Editor',
          parentLabel: 'Story Editor',
          parentTo: PUBLICATION_EDITOR_SLUG,
          items,
          currentId: storyId,
          localMenuCmp: (
            <LocalMenu
              options={[
                {
                  label: 'Editor',
                  to: `${PUBLICATION_EDITOR_SLUG}/${page.frontmatter.id}`
                },
                {
                  label: 'Metadata',
                  to: `${PUBLICATION_EDITOR_SLUG}/${page.frontmatter.id}/metadata`
                },
                {
                  label: 'Export',
                  to: `${PUBLICATION_EDITOR_SLUG}/${page.frontmatter.id}/export`
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
    navigate(`${PUBLICATION_EDITOR_SLUG}/${id}`);
  }, [createEditorDataStoryFromMDXDocument, newStory, navigate]);

  const deleteStory = useDeleteDataStory();

  return (
    <Routes>
      <Route path=':storyId' element={<DataStoryEditorLayout />} />
      <Route
        index
        element={
          <PageMainContent>
            <LayoutProps title='Story Editor' />
            <PageHero title='Story Editor' />
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
                              href={`${PUBLICATION_EDITOR_SLUG}/${dataStory.frontmatter.id}`}
                            >
                              Edit
                            </Button>
                            <Button onClick={() => deleteStory(dataStory.frontmatter.id)}>Delete</Button>
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

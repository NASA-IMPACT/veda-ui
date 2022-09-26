import React from 'react';
import styled from 'styled-components';

import { multiply, themeVal } from '@devseed-ui/theme-provider';
import {
  Toolbar,
  ToolbarIconButton,
  ToolbarLabel,
  VerticalDivider
} from '@devseed-ui/toolbar';
import {
  Form,
  FormGroupStructure,
  FormHelperMessage,
  FormInput
} from '@devseed-ui/form';
import {
  CollecticonArea,
  CollecticonCircleInformation,
  CollecticonEllipsisVertical,
  CollecticonTrashBin,
  CollecticonUpload2
} from '@devseed-ui/collecticons';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { resourceNotFound } from '$components/uhoh';

import { useThematicArea } from '$utils/thematics';

import { PageMainContent } from '$styles/page';
import Constrainer from '$styles/constrainer';
import { variableGlsp } from '$styles/variable-utils';
import { VarHeading } from '$styles/variable-components';

export const Block = styled.section`
  padding-top: ${variableGlsp(2)};
  padding-bottom: ${variableGlsp(2)};
  background: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.base-100a')};
`;

const BlockInner = styled(Constrainer)`
  display: flex;
  flex-flow: column nowrap;
`;

export const BlockHeader = styled.header`
  display: flex;
  flex-flow: row nowrap;
  gap: ${variableGlsp()};
`;

export const BlockHeadline = styled.div`
  /* styled-component */
`;

export const BlockTitle = styled(VarHeading).attrs({
  as: 'h2',
  size: 'small'
})`
  /* styled-component */
`;

export const BlockActions = styled.div`
  margin-left: auto;
`;

export const BlockBody = styled.div`
  /* styled-component */
`;

export const MapContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background: ${themeVal('color.base-50')};
  border-radius: ${multiply(themeVal('shape.rounded'), 2)};
  min-height: 24rem;
`;

const FormBlock = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${variableGlsp()};
`;

export default function Analysis() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  return (
    <PageMainContent>
      <LayoutProps
        title='Analysis'
        description='Visualize insights from a selected area over a period of time.'
        thumbnail={thematic.data.media?.src}
      />
      <PageHero
        title='Analysis'
        description='Visualize insights from a selected area over a period of time.'
      />
      <Block>
        <BlockInner>
          <BlockHeader>
            <BlockHeadline>
              <BlockTitle>Area</BlockTitle>
            </BlockHeadline>
            <BlockActions>
              <Toolbar size='small'>
                <ToolbarLabel>Actions</ToolbarLabel>
                <ToolbarIconButton variation='base-text'>
                  <CollecticonTrashBin title='Delete shape' meaningful />
                </ToolbarIconButton>
                <VerticalDivider variation='dark' />
                <ToolbarIconButton variation='base-text'>
                  <CollecticonArea title='Draw shape' meaningful />
                </ToolbarIconButton>
                <ToolbarIconButton variation='base-text'>
                  <CollecticonUpload2 title='Upload geoJSON' meaningful />
                </ToolbarIconButton>
                <ToolbarIconButton variation='base-text'>
                  <CollecticonEllipsisVertical
                    title='More options'
                    meaningful
                  />
                </ToolbarIconButton>
              </Toolbar>
            </BlockActions>
          </BlockHeader>
          <BlockBody>
            <MapContainer>
              <p>Map goes here.</p>
            </MapContainer>
          </BlockBody>
        </BlockInner>
      </Block>

      <Block>
        <BlockInner>
          <BlockHeader>
            <BlockHeadline>
              <BlockTitle>Date</BlockTitle>
            </BlockHeadline>
            <BlockActions>
              <Toolbar size='small'>
                <ToolbarLabel>Actions</ToolbarLabel>
                <ToolbarIconButton variation='base-text'>
                  <CollecticonEllipsisVertical title='Options' meaningful />
                </ToolbarIconButton>
              </Toolbar>
            </BlockActions>
          </BlockHeader>
          <BlockBody>
            <Form>
              <FormBlock>
                <FormGroupStructure label='Start' id='input-text-a' required>
                  <FormInput
                    type='text'
                    size='large'
                    id='input-text-a'
                    placeholder='YYYY / MM / DD'
                  />
                </FormGroupStructure>

                <FormGroupStructure label='End' id='input-text-b'>
                  <FormInput
                    type='text'
                    size='large'
                    id='input-text-b'
                    placeholder='YYYY / MM / DD'
                  />
                </FormGroupStructure>
              </FormBlock>
            </Form>
          </BlockBody>
        </BlockInner>
      </Block>
    </PageMainContent>
  );
}

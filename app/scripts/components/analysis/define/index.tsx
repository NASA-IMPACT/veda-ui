import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { media, multiply, themeVal } from '@devseed-ui/theme-provider';
import {
  Toolbar,
  ToolbarIconButton,
  ToolbarLabel,
  VerticalDivider
} from '@devseed-ui/toolbar';
import {
  Dropdown,
  DropMenu,
  DropMenuItem,
  DropTitle
} from '@devseed-ui/dropdown';
import {
  Form,
  FormCheckable,
  FormGroupStructure,
  FormInput
} from '@devseed-ui/form';
import {
  CollecticonArea,
  CollecticonCircleInformation,
  CollecticonEllipsisVertical,
  CollecticonTickSmall,
  CollecticonTrashBin,
  CollecticonUpload2,
  CollecticonXmarkSmall
} from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';

import { useThematicArea } from '$utils/thematics';
import { variableGlsp } from '$styles/variable-utils';
import {
  analysisParams2QueryString,
  useAnalysisParams
} from '../results/use-analysis-params';
import { thematicAnalysisPath } from '$utils/routes';

import { PageMainContent } from '$styles/page';
import { LayoutProps } from '$components/common/layout-root';
import PageHeroAnalysis from '$components/analysis/page-hero-analysis';
import { resourceNotFound } from '$components/uhoh';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldHeadActions,
  FoldTitle,
  FoldBody
} from '$components/common/fold';
import { Tip } from '$components/common/tip';

const MapContainer = styled.div`
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
  gap: ${variableGlsp(0.5)};

  > * {
    width: 50%;
  }
`;

const CheckableGroup = styled.div`
  display: grid;
  gap: ${variableGlsp(0.5)};
  grid-template-columns: repeat(2, 1fr);
  background: ${themeVal('color.surface')};

  ${media.mediumUp`
    grid-template-columns: repeat(3, 1fr);
  `}

  ${media.xlargeUp`
    grid-template-columns: repeat(4, 1fr);
  `}
`;

const FormCheckableCustom = styled(FormCheckable)`
  padding: ${variableGlsp(0.5)};
  background: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.base-100a')};
  border-radius: ${themeVal('shape.rounded')};
`;

export const Note = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp(0.5)};
  justify-content: center;
  align-items: center;
  text-align: center;
  background: ${themeVal('color.base-50')};
  border-radius: ${multiply(themeVal('shape.rounded'), 2)};
  min-height: 12rem;
  padding: ${variableGlsp()};

  [class*='Collecticon'] {
    opacity: 0.32;
  }
`;

export default function Analysis() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  const { date, datasetsLayers, aoi, errors } = useAnalysisParams();

  // If there are errors in the url parameters it means that this should be
  // treated as a new analysis. If the parameters are all there and correct, the
  // user is refining the analysis.
  const isNewAnalysis = !!errors?.length;

  const analysisParamsQs = analysisParams2QueryString({
    date,
    datasetsLayers,
    aoi
  });

  return (
    <PageMainContent>
      <LayoutProps
        title='Analysis'
        description='Visualize insights from a selected area over a period of time.'
        thumbnail={thematic.data.media?.src}
      />
      <PageHeroAnalysis
        title={isNewAnalysis ? 'Start analysis' : 'Refine analysis'}
        description='Visualize insights from a selected area over a period of time.'
        renderActions={({ size }) => (
          <>
            {!isNewAnalysis && (
              <Button
                forwardedAs={Link}
                to={`${thematicAnalysisPath(thematic)}/results${analysisParamsQs}`}
                type='button'
                size={size}
                variation='achromic-outline'
              >
                <CollecticonXmarkSmall /> Cancel
              </Button>
            )}
            <Tip
              visible
              placement='bottom-end'
              content='To get results, define an area, pick a date and select datasets.'
            >
              <Button type='button' size={size} variation='achromic-outline'>
                <CollecticonTickSmall /> Save
              </Button>
            </Tip>
          </>
        )}
      />
      <Fold>
        <FoldHeader>
          <FoldHeadline>
            <FoldTitle>Area</FoldTitle>
          </FoldHeadline>
          <FoldHeadActions>
            <Toolbar size='small'>
              <ToolbarLabel>Actions</ToolbarLabel>
              <ToolbarIconButton variation='base-text' disabled>
                <CollecticonTrashBin title='Delete shape' meaningful />
              </ToolbarIconButton>
              <VerticalDivider variation='dark' />
              <ToolbarIconButton variation='base-text'>
                <CollecticonArea title='Draw shape' meaningful />
              </ToolbarIconButton>
              <ToolbarIconButton variation='base-text'>
                <CollecticonUpload2 title='Upload geoJSON' meaningful />
              </ToolbarIconButton>
              <Dropdown
                alignment='right'
                triggerElement={(props) => (
                  <ToolbarIconButton variation='base-text' {...props}>
                    <CollecticonEllipsisVertical
                      title='More options'
                      meaningful
                    />
                  </ToolbarIconButton>
                )}
              >
                <DropTitle>Select a country</DropTitle>
                <DropMenu>
                  <li>
                    <DropMenuItem href='#'>Country name A</DropMenuItem>
                  </li>
                  <li>
                    <DropMenuItem href='#'>Country name B</DropMenuItem>
                  </li>
                  <li>
                    <DropMenuItem href='#'>Country name C</DropMenuItem>
                  </li>
                  <li>
                    <DropMenuItem href='#'>Country name D</DropMenuItem>
                  </li>
                </DropMenu>
              </Dropdown>
            </Toolbar>
          </FoldHeadActions>
        </FoldHeader>
        <FoldBody>
          <MapContainer>
            <p>Map goes here.</p>
          </MapContainer>
        </FoldBody>
      </Fold>

      <Fold>
        <FoldHeader>
          <FoldHeadline>
            <FoldTitle>Date</FoldTitle>
          </FoldHeadline>
          <FoldHeadActions>
            <Toolbar size='small'>
              <ToolbarLabel>Actions</ToolbarLabel>
              <Dropdown
                alignment='right'
                triggerElement={(props) => (
                  <ToolbarIconButton variation='base-text' {...props}>
                    <CollecticonEllipsisVertical
                      title='More options'
                      meaningful
                    />
                  </ToolbarIconButton>
                )}
              >
                <DropTitle>Select a date preset</DropTitle>
                <DropMenu>
                  <li>
                    <DropMenuItem href='#'>Preset A</DropMenuItem>
                  </li>
                  <li>
                    <DropMenuItem href='#'>Preset B</DropMenuItem>
                  </li>
                  <li>
                    <DropMenuItem href='#'>Preset C</DropMenuItem>
                  </li>
                  <li>
                    <DropMenuItem href='#'>Preset D</DropMenuItem>
                  </li>
                </DropMenu>
              </Dropdown>
            </Toolbar>
          </FoldHeadActions>
        </FoldHeader>
        <FoldBody>
          <Form>
            <FormBlock>
              <FormGroupStructure label='Start' id='start-date' required>
                <FormInput
                  type='date'
                  size='large'
                  id='start-date'
                  name='start-date'
                />
              </FormGroupStructure>

              <FormGroupStructure label='End' id='end-date' required>
                <FormInput
                  type='date'
                  size='large'
                  id='end-date'
                  name='end-date'
                />
              </FormGroupStructure>
            </FormBlock>
          </Form>
        </FoldBody>
      </Fold>

      <Fold>
        <FoldHeader>
          <FoldHeadline>
            <FoldTitle>Datasets</FoldTitle>
          </FoldHeadline>
        </FoldHeader>
        <FoldBody>
          <Note>
            <CollecticonCircleInformation size='large' />
            <p>To select datasets, please define an area and a date first.</p>
          </Note>
          <Form>
            <CheckableGroup>
              <FormCheckableCustom
                id='dataset-a'
                name='dataset-a'
                textPlacement='right'
                type='checkbox'
              >
                Dataset name
              </FormCheckableCustom>

              <FormCheckableCustom
                id='dataset-b'
                name='dataset-b'
                textPlacement='right'
                type='checkbox'
              >
                Dataset name
              </FormCheckableCustom>

              <FormCheckableCustom
                id='dataset-c'
                name='dataset-c'
                textPlacement='right'
                type='checkbox'
              >
                Dataset name
              </FormCheckableCustom>

              <FormCheckableCustom
                id='dataset-d'
                name='dataset-d'
                textPlacement='right'
                type='checkbox'
              >
                Dataset name
              </FormCheckableCustom>

              <FormCheckableCustom
                id='dataset-e'
                name='dataset-e'
                textPlacement='right'
                type='checkbox'
              >
                Dataset name
              </FormCheckableCustom>

              <FormCheckableCustom
                id='dataset-f'
                name='dataset-f'
                textPlacement='right'
                type='checkbox'
              >
                Dataset name
              </FormCheckableCustom>
            </CheckableGroup>
          </Form>
        </FoldBody>
      </Fold>
    </PageMainContent>
  );
}

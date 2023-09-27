import React, {
  useCallback,
  useEffect,
  useMemo,
  MouseEvent,
  useRef
} from 'react';
import styled from 'styled-components';
import { media, multiply, themeVal } from '@devseed-ui/theme-provider';
import { Toolbar, ToolbarLabel } from '@devseed-ui/toolbar';
import {
  Form,
  FormCheckable,
  FormGroupStructure,
  FormInput
} from '@devseed-ui/form';
import {
  CollecticonCircleInformation,
  CollecticonSignDanger
} from '@devseed-ui/collecticons';
import { Overline } from '@devseed-ui/typography';

import { datasets, DatasetLayer } from 'veda';
import { Button, ButtonGroup } from '@devseed-ui/button';
import { useAnalysisParams } from '../results/use-analysis-params';
import SavedAnalysisControl from '../saved-analysis-control';
import AoiSelector from './aoi-selector';
import { useStacCollectionSearch } from './use-stac-collection-search';
import PageFooterActions from './page-footer.actions';
import { variableGlsp } from '$styles/variable-utils';

import { PageMainContent } from '$styles/page';
import { LayoutProps } from '$components/common/layout-root';
import PageHeroAnalysis from '$components/analysis/page-hero-analysis';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldHeadActions,
  FoldTitle,
  FoldBody
} from '$components/common/fold';
import { S_FAILED, S_LOADING, S_SUCCEEDED } from '$utils/status';
import { useAoiControls } from '$components/common/aoi/use-aoi-controls';
import {
  DateRangePreset,
  dateToInputFormat,
  getRangeFromPreset,
  inputFormatToDate
} from '$utils/date';

import { MapboxMapRef } from '$components/common/mapbox';
import { ANALYSIS_PATH } from '$utils/routes';

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
  align-items: center;
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

const UnselectableInfo = styled.div`
  font-size: 0.825rem;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: ${variableGlsp(0.5)};

  & path {
    fill: ${themeVal('color.danger')};
  }
`;

const FormCheckableUnselectable = styled(FormCheckableCustom)`
  pointer-events: none;
  background: #f0f0f5;
`;

const DataPointsWarning = styled.div`
  display: flex;
  align-items: center;
  background: ${themeVal('color.danger-100')};
  border-radius: 99px;
  font-size: 0.825rem;
  font-weight: bold;
  margin-top: ${variableGlsp(0.5)};
  paddding: 4px;

  & path {
    fill: ${themeVal('color.danger')};
  }
`;

const FloatingFooter = styled.div<{ isSticky: boolean }>`
  position: sticky;
  left: 0;
  right: 0;
  // trick to get the IntersectionObserver to fire
  bottom: -1px;
  padding: ${variableGlsp(0.5)};
  background: ${themeVal('color.surface')};
  z-index: 99;
  margin-bottom: ${variableGlsp(1)};
  ${(props) =>
    props.isSticky &&
    `
      box-shadow: 0 0 10px 0 #0003;
    `}
`;

const FoldWithBullet = styled(Fold)<{ number: string }>`
  ${media.largeUp`
  padding-left: ${variableGlsp(1)};
  > div {
    padding-left: ${variableGlsp(2)};
    position: relative;
    // bullet
    &::after {
      position: absolute;
      top: ${variableGlsp(-0.25)};
      left: ${variableGlsp(-1)};
      width: ${variableGlsp(2)};
      height: ${variableGlsp(2)};
      background-color: #1565EF;
      color: ${themeVal('color.surface')};
      border-radius: ${themeVal('shape.ellipsoid')};
      font-size: 1.75rem;
      display: flex;
      justify-content: center;
      align-items: center;
      font-weight: 600;
      ${(props) => `content: "${props.number}";`}
    }
  }
`}
`;

export const FoldWGuideLine = styled(FoldWithBullet)`
  ${media.largeUp`
    padding-bottom: 0;
    > div {
      border-left : 3px solid ${themeVal('color.base-200a')};
      padding-bottom:  ${variableGlsp(2)};
    }
  `}
`;

const FoldWOPadding = styled(Fold)`
  padding: 0;
`;

export const FoldTitleWOAccent = styled(FoldTitle)`
  ${media.largeUp`
    &::before {
      content: none;
    }
  `}
`;

const FormGroupStructureCustom = styled(FormGroupStructure)`
  ${media.largeUp`
    display: inline-flex;
    align-items: center;
  `}
`;

const FoldBodyCustom = styled(FoldBody)`
  ${media.largeUp`
    flex-flow: row;
    flex-grow: 3;
    justify-content: space-between;
  `}
`;

const findParentDataset = (layerId: string) => {
  const parentDataset = Object.values(datasets).find((dataset) =>
    dataset!.data.layers.find((l) => l.id === layerId)
  );
  return parentDataset?.data;
};

export const allAvailableDatasetsLayers: DatasetLayer[] = Object.values(
  datasets
)
  .map((dataset) => dataset!.data.layers)
  .flat()
  .filter((d) => d.type !== 'vector' && !d.analysis?.exclude);

export default function Analysis() {
  const { params, setAnalysisParam } = useAnalysisParams();
  const { start, end, datasetsLayers, aoi, errors } = params;

  const mapRef = useRef<MapboxMapRef>(null);
  const { aoi: aoiDrawState, onAoiEvent } = useAoiControls(mapRef, {
    drawing: true
  });

  // If there are errors in the url parameters it means that this should be
  // treated as a new analysis. If the parameters are all there and correct, the
  // user is refining the analysis.
  const isNewAnalysis = !!errors?.length;

  const onStartDateChange = useCallback(
    (e) => {
      if (!e.target.value || e.target.value === '') {
        setAnalysisParam('start', null);
        return;
      }
      setAnalysisParam('start', inputFormatToDate(e.target.value));
    },
    [setAnalysisParam]
  );

  const onEndDateChange = useCallback(
    (e) => {
      if (!e.target.value || e.target.value === '') {
        setAnalysisParam('end', null);
        return;
      }
      setAnalysisParam('end', inputFormatToDate(e.target.value));
    },
    [setAnalysisParam]
  );

  const onDatePresetClick = useCallback(
    (e: MouseEvent, preset: DateRangePreset) => {
      e.preventDefault();
      const { start, end } = getRangeFromPreset(preset);
      setAnalysisParam('start', start);
      setAnalysisParam('end', end);
    },
    [setAnalysisParam]
  );

  const selectedDatasetLayerIds = datasetsLayers?.map((layer) => layer.id);

  const onDatasetLayerChange = useCallback(
    (e) => {
      const id = e.target.id;
      let newDatasetsLayers = [...(datasetsLayers || [])];
      if (e.target.checked) {
        const newDatasetLayer = allAvailableDatasetsLayers.find(
          (l) => l.id === id
        );
        if (newDatasetLayer) {
          newDatasetsLayers = [...newDatasetsLayers, newDatasetLayer];
        }
      } else {
        newDatasetsLayers = newDatasetsLayers.filter((l) => l.id !== id);
      }
      setAnalysisParam('datasetsLayers', newDatasetsLayers);
    },
    [setAnalysisParam, datasetsLayers]
  );

  const {
    selectableDatasetLayers,
    unselectableDatasetLayers,
    stacSearchStatus,
    readyToLoadDatasets
  } = useStacCollectionSearch({
    start,
    end,
    aoi: aoiDrawState.featureCollection
  });

  // Update datasetsLayers when stac search is refreshed in case some
  // datasetsLayers are not available anymore
  useEffect(() => {
    if (!datasetsLayers) return;
    const selectableDatasetLayersIds = selectableDatasetLayers.map(
      (layer) => layer.id
    );
    const cleanedDatasetsLayers = datasetsLayers.filter((l) =>
      selectableDatasetLayersIds.includes(l.id)
    );

    setAnalysisParam('datasetsLayers', cleanedDatasetsLayers);
    // Only update when stac search gets updated to avoid triggering an infinite
    // read/set state loop
  }, [selectableDatasetLayers, setAnalysisParam]);

  const notReady = !readyToLoadDatasets || !datasetsLayers?.length;

  const infoboxMessage = useMemo(() => {
    if (
      readyToLoadDatasets &&
      stacSearchStatus === S_SUCCEEDED &&
      selectableDatasetLayers.length
    ) {
      return;
    }

    if (!readyToLoadDatasets) {
      return 'To select datasets, please define an area and a date first.';
    } else {
      if (stacSearchStatus === S_LOADING) {
        return 'Loading...';
      } else if (stacSearchStatus === S_FAILED) {
        return 'Error loading datasets.';
      } else if (!selectableDatasetLayers.length) {
        return 'No datasets available for the currently selected dates and area.';
      }
    }
  }, [readyToLoadDatasets, stacSearchStatus, selectableDatasetLayers.length]);

  const footerRef = useRef<HTMLDivElement>(null);
  const [isFooterSticky, setIsFooterSticky] = React.useState(false);
  useEffect(() => {
    if (!footerRef.current) return;
    const observer = new IntersectionObserver(
      ([e]) => {
        setIsFooterSticky(e.intersectionRatio < 1);
      },
      { threshold: [1] }
    );
    observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <PageMainContent>
        <LayoutProps
          title='Analysis'
          description='Generate timeseries data for your area of interest.'
        />
        <PageHeroAnalysis
          title='Data analysis'
          description='Generate timeseries data for your area of interest.'
          renderActions={({ size }) => (
            <SavedAnalysisControl size={size} urlBase={ANALYSIS_PATH} />
          )}
        />
        <AoiSelector
          mapRef={mapRef}
          // Use aoi initially decode from qs
          qsAoi={aoi}
          aoiDrawState={aoiDrawState}
          onAoiEvent={onAoiEvent}
        />

        <FoldWGuideLine number='2'>
          <FoldHeader>
            <FoldHeadline>
              <FoldTitleWOAccent>Pick a date period</FoldTitleWOAccent>
              <p>
                Select start and end date of time series, or choose a pre-set
                date range.
              </p>
            </FoldHeadline>
            <FoldHeadActions></FoldHeadActions>
          </FoldHeader>
          <FoldBodyCustom>
            <Form>
              <FormBlock>
                <FormGroupStructureCustom label='From' id='start-date' required>
                  <FormInput
                    type='date'
                    size='large'
                    id='start-date'
                    name='start-date'
                    value={start ? dateToInputFormat(start) : ''}
                    onChange={onStartDateChange}
                    min='1980-01-01'
                    max={dateToInputFormat(end)}
                  />
                </FormGroupStructureCustom>

                <FormGroupStructureCustom label='To' id='end-date' required>
                  <FormInput
                    type='date'
                    size='large'
                    id='end-date'
                    name='end-date'
                    value={end ? dateToInputFormat(end) : ''}
                    onChange={onEndDateChange}
                    min={dateToInputFormat(start)}
                    max='2022-12-31'
                  />
                </FormGroupStructureCustom>
              </FormBlock>
            </Form>
            <Toolbar size='small'>
              <ToolbarLabel>Presets</ToolbarLabel>
              <ButtonGroup variation='base-outline' radius='square'>
                <Button onClick={(e) => onDatePresetClick(e, 'last10Years')}>
                  Last 10 years
                </Button>
                <Button onClick={(e) => onDatePresetClick(e, '2018-2022')}>
                  2018 - 2022
                </Button>
              </ButtonGroup>
            </Toolbar>
          </FoldBodyCustom>
        </FoldWGuideLine>

        <FoldWithBullet number='3'>
          <FoldHeader>
            <FoldHeadline>
              <FoldTitleWOAccent>Select datasets</FoldTitleWOAccent>
              <p>
                Select from available dataset layers for the area and date range
                selected.
              </p>
            </FoldHeadline>
          </FoldHeader>
          <FoldBody>
            {!infoboxMessage ? (
              <>
                <Form>
                  <CheckableGroup>
                    {selectableDatasetLayers.map((datasetLayer) => (
                      <FormCheckableCustom
                        key={datasetLayer.id}
                        id={datasetLayer.id}
                        name={datasetLayer.id}
                        value={datasetLayer.id}
                        textPlacement='right'
                        type='checkbox'
                        onChange={onDatasetLayerChange}
                        checked={
                          selectedDatasetLayerIds?.includes(datasetLayer.id) ??
                          false
                        }
                      >
                        <Overline>
                          From: {findParentDataset(datasetLayer.id)?.name}
                        </Overline>
                        {datasetLayer.name}
                      </FormCheckableCustom>
                    ))}
                  </CheckableGroup>
                </Form>
                {!!unselectableDatasetLayers.length && (
                  <>
                    <UnselectableInfo>
                      <CollecticonSignDanger />
                      The current area and date selection has returned (
                      {unselectableDatasetLayers.length}) datasets with a very
                      large number of data points. To make them available,
                      please define a smaller area or a select a shorter date
                      period.
                    </UnselectableInfo>

                    <Form>
                      <CheckableGroup>
                        {unselectableDatasetLayers.map((datasetLayer) => (
                          <FormCheckableUnselectable
                            key={datasetLayer.id}
                            id={datasetLayer.id}
                            name={datasetLayer.id}
                            value={datasetLayer.id}
                            textPlacement='right'
                            type='checkbox'
                            onChange={onDatasetLayerChange}
                            checked={false}
                          >
                            <Overline>
                              From: {findParentDataset(datasetLayer.id)?.name}
                            </Overline>
                            {datasetLayer.name}
                            <DataPointsWarning>
                              <CollecticonSignDanger />~
                              {datasetLayer.numberOfItems} data points
                            </DataPointsWarning>
                          </FormCheckableUnselectable>
                        ))}
                      </CheckableGroup>
                    </Form>
                  </>
                )}
              </>
            ) : (
              <Note>
                <CollecticonCircleInformation size='large' />
                <p>{infoboxMessage}</p>
              </Note>
            )}
          </FoldBody>
        </FoldWithBullet>
      </PageMainContent>
      <FloatingFooter ref={footerRef} isSticky={isFooterSticky}>
        <FoldWOPadding>
          <FoldBody>
            <PageFooterActions
              isNewAnalysis={isNewAnalysis}
              start={start}
              end={end}
              datasetsLayers={datasetsLayers}
              aoi={aoiDrawState.featureCollection}
              disabled={notReady}
            />
          </FoldBody>
        </FoldWOPadding>
      </FloatingFooter>
    </>
  );
}

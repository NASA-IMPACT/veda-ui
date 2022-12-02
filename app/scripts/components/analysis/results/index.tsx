import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import { media } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { CollecticonPencil } from '@devseed-ui/collecticons';

import {
  analysisParams2QueryString,
  useAnalysisParams
} from './use-analysis-params';
import {
  requestStacDatasetsTimeseries,
  TimeseriesData
} from './timeseries-data';
import ChartCard from './chart-card';
import AnalysisHeadActions, {
  DataMetric,
  dataMetrics
} from './analysis-head-actions';
import { LayoutProps } from '$components/common/layout-root';
import { CardList } from '$components/common/card';
import {
  Fold,
  FoldHeader,
  FoldHeadline,
  FoldTitle,
  FoldBody
} from '$components/common/fold';
import PageHeroAnalysis from '$components/analysis/page-hero-analysis';
import { resourceNotFound } from '$components/uhoh';
import { PageMainContent } from '$styles/page';
import { useThematicArea } from '$utils/thematics';
import { thematicAnalysisPath } from '$utils/routes';
import { formatDateRange } from '$utils/date';
import { pluralize } from '$utils/pluralize';
import { calcFeatArea } from '$components/common/aoi/utils';

const ChartCardList = styled(CardList)`
  > li {
    min-width: 0;
  }

  ${media.largeUp`
    grid-template-columns: repeat(2, 1fr);
  `}
`;

const AnalysisFold = styled(Fold)`
  /* When the page is too small, the shrinking header causes itself to become
  unstuck (because the page stops having an overflow). Since this happens only
  under specific screen sizes, this small hack solves the problem with minimal
  visual impact. */
  min-height: calc(100vh - 190px);
`;

export default function AnalysisResults() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  const queryClient = useQueryClient();
  const [requestStatus, setRequestStatus] = useState<TimeseriesData[]>([]);
  const { params } = useAnalysisParams();
  const { start, end, datasetsLayers, aoi, errors } = params;

  const [activeMetrics, setActiveMetrics] = useState<DataMetric[]>(dataMetrics);

  useEffect(() => {
    if (!start || !end || !datasetsLayers || !aoi) return;

    const controller = new AbortController();

    setRequestStatus([]);
    const requester = requestStacDatasetsTimeseries({
      start,
      end,
      aoi,
      layers: datasetsLayers,
      queryClient,
      signal: controller.signal
    });

    requester.on('data', (data, index) => {
      setRequestStatus((dataStore) =>
        Object.assign([], dataStore, {
          [index]: data
        })
      );
    });

    return () => {
      controller.abort();
    };
  }, [queryClient, start, end, datasetsLayers, aoi]);

  // Textual description for the meta tags and element for the page hero.
  const descriptions = useMemo(() => {
    if (!start || !end || !datasetsLayers || !aoi) {
      return { meta: '', page: '' };
    }

    const dateLabel = formatDateRange(start, end);
    const area = calcFeatArea(aoi);
    const datasetCount = pluralize({
      singular: 'dataset',
      count: datasetsLayers.length,
      showCount: true
    });

    return {
      meta: `Covering ${datasetCount} over a ${area} km2 area from ${dateLabel}.`,
      page: (
        <>
          Covering <strong>{datasetCount}</strong> over a{' '}
          <strong>
            {area} km<sup>2</sup>
          </strong>{' '}
          area from <strong>{dateLabel}</strong>.
        </>
      )
    };
  }, [start, end, datasetsLayers, aoi]);

  const analysisParamsQs = analysisParams2QueryString({
    start,
    end,
    datasetsLayers,
    aoi
  });

  const availableDomain: [Date, Date] | null = useMemo(
    () => (start && end ? [start, end] : null),
    [start, end]
  );

  const [brushRange, setBrushRange] = useState<[Date, Date] | null>(null);

  useEffect(() => {
    if (availableDomain && !brushRange) {
      // TODO auto fit to available data
      setBrushRange(availableDomain);
    }
  }, [availableDomain, brushRange]);


  if (errors?.length) {
    return <Navigate to={thematicAnalysisPath(thematic)} replace />;
  }

  return (
    <PageMainContent>
      <LayoutProps
        title='Analysis'
        description={descriptions.meta}
        thumbnail={thematic.data.media?.src}
      />
      <PageHeroAnalysis
        title='Analysis'
        description={descriptions.page}
        isResults
        aoiFeature={aoi}
        renderActions={({ size }) => (
          <Button
            forwardedAs={Link}
            to={`${thematicAnalysisPath(thematic)}${analysisParamsQs}`}
            size={size}
            variation='achromic-outline'
          >
            <CollecticonPencil /> Refine
          </Button>
        )}
      />
      <AnalysisFold>
        <FoldHeader>
          <FoldHeadline>
            <FoldTitle>Results</FoldTitle>
          </FoldHeadline>
          <AnalysisHeadActions
            activeMetrics={activeMetrics}
            onMetricsChange={setActiveMetrics}
          />
        </FoldHeader>
        <FoldBody>
          {!!requestStatus.length && availableDomain && brushRange && (
            <ChartCardList>
              {requestStatus.map((l) => (
                <li key={l.id}>
                  <ChartCard
                    title={l.name}
                    chartData={l}
                    activeMetrics={activeMetrics}
                    availableDomain={availableDomain}
                    brushRange={brushRange}
                    onBrushRangeChange={(range) => setBrushRange(range)}
                  />
                </li>
              ))}
            </ChartCardList>
          )}
        </FoldBody>
      </AnalysisFold>
    </PageMainContent>
  );
}

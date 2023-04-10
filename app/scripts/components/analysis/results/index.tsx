import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import { useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router';
import { Link } from 'react-router-dom';
import { max, min } from 'd3';
import { media } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { CollecticonPencil } from '@devseed-ui/collecticons';
import { VerticalDivider } from '@devseed-ui/toolbar';

import SavedAnalysisControl from '../saved-analysis-control';
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
import { PageMainContent } from '$styles/page';
import { formatDateRange } from '$utils/date';
import { pluralize } from '$utils/pluralize';
import { calcFeatCollArea } from '$components/common/aoi/utils';
import { ANALYSIS_PATH, ANALYSIS_RESULTS_PATH } from '$utils/routes';

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

const AnalysisFoldHeader = styled(FoldHeader)`
  flex-flow: row wrap;

  ${media.mediumUp`
    flex-flow: row nowrap;
  `}
`;

export default function AnalysisResults() {
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
    const area = calcFeatCollArea(aoi);
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

  const availableDomain: [Date, Date] | null = useMemo(() => {
    if (!start || !end) return null;
    const onlySingleValues = requestStatus.every(
      (rs) => rs.data?.timeseries.length === 1
    );

    const { minDate, maxDate } = requestStatus.reduce(
      (acc, item) => {
        if (item.data?.timeseries) {
          const itemDates = item.data.timeseries.map((t) => +new Date(t.date));
          const itemMin = min(itemDates) ?? Number.POSITIVE_INFINITY;
          const itemMax = max(itemDates) ?? Number.NEGATIVE_INFINITY;

          return {
            minDate: itemMin < acc.minDate ? itemMin : acc.minDate,
            maxDate: itemMax > acc.maxDate ? itemMax : acc.maxDate
          };
        }
        return acc;
      },
      {
        minDate: onlySingleValues ? Number.POSITIVE_INFINITY : +start,
        maxDate: onlySingleValues ? Number.NEGATIVE_INFINITY : +end
      }
    );

    if (!onlySingleValues) {
      return [new Date(minDate), new Date(maxDate)];
    }

    // When all data only contain one value, we need to pad the domain to make sure the single value is shown in the center of the chart
    // substract/add one day
    return [new Date(minDate - 86400000), new Date(minDate + 86400000)];
  }, [start, end, requestStatus]);

  const [brushRange, setBrushRange] = useState<[Date, Date] | null>(null);

  useEffect(() => {
    if (availableDomain) {
      // TODO auto fit to available data? For now taking the whole user-defined range
      setBrushRange(availableDomain);
    }
  }, [availableDomain]);

  if (errors?.length) {
    return <Navigate to={ANALYSIS_PATH} replace />;
  }

  return (
    <PageMainContent>
      <LayoutProps
        title='Analysis'
        description={descriptions.meta}
      />
      <PageHeroAnalysis
        title='Analysis'
        description={descriptions.page}
        isResults
        aoi={aoi}
        renderActions={({ size }) => (
          <>
            <Button
              forwardedAs={Link}
              to={`${ANALYSIS_PATH}${analysisParamsQs}`}
              size={size}
              variation='achromic-outline'
            >
              <CollecticonPencil /> Refine
            </Button>

            <VerticalDivider variation='light' />

            <SavedAnalysisControl size={size} urlBase={ANALYSIS_RESULTS_PATH} />
          </>
        )}
      />
      <AnalysisFold>
        <AnalysisFoldHeader>
          <FoldHeadline>
            <FoldTitle>Results</FoldTitle>
          </FoldHeadline>
          <AnalysisHeadActions
            activeMetrics={activeMetrics}
            onMetricsChange={setActiveMetrics}
          />
        </AnalysisFoldHeader>
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

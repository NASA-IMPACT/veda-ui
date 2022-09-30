import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Navigate } from 'react-router';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { resourceNotFound } from '$components/uhoh';
import { PageMainContent } from '$styles/page';

import { useThematicArea } from '$utils/thematics';
import { thematicAnalysisPath } from '$utils/routes';
import { useAnalysisParams } from './use-analysis-params';
import {
  requestStacDatasetsTimeseries,
  TimeseriesData,
  TIMESERIES_DATA_BASE_ID
} from './timeseries-data';

export default function AnalysisResults() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  const queryClient = useQueryClient();
  const [requestStatus, setRequestStatus] = useState<TimeseriesData[]>([]);
  const { date, datasetsLayers, aoi, errors } = useAnalysisParams();

  useEffect(() => {
    if (!date.start || !datasetsLayers || !aoi) return;

    setRequestStatus([]);
    queryClient.cancelQueries([TIMESERIES_DATA_BASE_ID]);
    const requester = requestStacDatasetsTimeseries({
      date,
      aoi,
      layers: datasetsLayers,
      queryClient
    });

    requester.on('data', (data, index) => {
      setRequestStatus((dataStore) =>
        Object.assign([], dataStore, {
          [index]: data
        })
      );
    });
  }, [queryClient, date, datasetsLayers, aoi]);

  if (errors) {
    return <Navigate to={thematicAnalysisPath(thematic)} replace />;
  }

  return (
    <PageMainContent>
      <LayoutProps
        title='Analysis Results'
        description='Visualize insights from a selected area over a period of time.'
        thumbnail={thematic.data.media?.src}
      />
      <PageHero
        title='Analysis Results'
        description='Visualize insights from a selected area over a period of time.'
      />
      <Fold>
        <FoldHeader>
          <FoldTitle>Analysis Results</FoldTitle>
        </FoldHeader>
        <div>
          {!!requestStatus.length && (
            <ul>
              {requestStatus.map((l) => (
                <li key={l.id}>
                  <h5>{l.name}</h5>
                  {l.status === 'errored' && (
                    <p>Something went wrong: {l.error.message}</p>
                  )}

                  {l.status === 'loading' && (
                    <p>
                      {l.meta.loaded} of {l.meta.total} loaded. Wait
                    </p>
                  )}

                  {l.status === 'succeeded' && !!l.data.timeseries.length && (
                    <p>All good. Can show data now.</p>
                  )}

                  {l.status === 'succeeded' && !l.data.timeseries.length && (
                    <p>There is no data available</p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </Fold>
    </PageMainContent>
  );
}

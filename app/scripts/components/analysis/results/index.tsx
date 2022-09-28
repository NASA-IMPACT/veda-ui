import React, { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { resourceNotFound } from '$components/uhoh';
import { PageMainContent } from '$styles/page';

import { useThematicArea } from '$utils/thematics';
import { useAnalysisParams } from './use-analysis-params';
import { requestStacDatasetsTimeseries } from './timeseries-data';

export default function AnalysisResults() {
  const thematic = useThematicArea();
  if (!thematic) throw resourceNotFound();

  const queryClient = useQueryClient();
  const [requestStatus, setRequestStatus] = useState([]);
  const { date, datasetsLayers, aoi } = useAnalysisParams();

  console.log("🚀 ~ file: index.tsx ~ line 20 ~ AnalysisResults ~ requestStatus", requestStatus);

  useEffect(() => {
    if (!date.start || !datasetsLayers || !aoi) return;

    setRequestStatus([]);
    queryClient.cancelQueries(['analysis']);
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
          <p>Content goes here.</p>
        </div>
      </Fold>
    </PageMainContent>
  );
}

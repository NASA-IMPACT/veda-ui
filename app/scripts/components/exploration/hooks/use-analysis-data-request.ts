import { useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FeatureCollection, Polygon } from 'geojson';
import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';

import { requestDatasetTimeseriesData } from '../analysis-data';
import { analysisControllerAtom, selectedIntervalAtom } from '../atoms/atoms';
import { useTimelineDatasetAnalysis } from '../atoms/hooks';
import { analysisConcurrencyManager } from '../concurrency';
import { TimelineDataset, TimelineDatasetStatus } from '../types.d.ts';
import useAois from '$components/common/map/controls/hooks/use-aois';

export function useAnalysisController() {
  const [controller, setController] = useAtom(analysisControllerAtom);

  return {
    analysisRun: controller.runId,
    isAnalyzing: controller.isAnalyzing,
    isObsolete: controller.isObsolete,
    setObsolete: useCallback(
      () => setController((v) => ({ ...v, isObsolete: true })),
      [] // eslint-disable-line react-hooks/exhaustive-deps -- setController is stable
    ),
    runAnalysis: useCallback(
      () =>
        setController((v) => ({
          ...v,
          runId: v.runId + 1,
          isAnalyzing: true,
          isObsolete: false
        })),
      [] // eslint-disable-line react-hooks/exhaustive-deps -- setController is stable
    ),
    cancelAnalysis: useCallback(
      () =>
        setController((v) => ({
          ...v,
          runId: 0,
          isAnalyzing: false,
          isObsolete: false
        })),
      [] // eslint-disable-line react-hooks/exhaustive-deps -- setController is stable
    )
  };
}

export function useAnalysisDataRequest({
  datasetAtom
}: {
  datasetAtom: PrimitiveAtom<TimelineDataset>;
}) {
  const queryClient = useQueryClient();

  const selectedInterval = useAtomValue(selectedIntervalAtom);
  const { features } = useAois();
  const selectedFeatures = features.filter((f) => f.selected);

  const { analysisRun } = useAnalysisController();

  const dataset = useAtomValue(datasetAtom);
  const datasetStatus = dataset.status;

  const [, setAnalysis] = useTimelineDatasetAnalysis(datasetAtom);

  useEffect(() => {
    if (
      datasetStatus !== TimelineDatasetStatus.SUCCESS ||
      !selectedInterval ||
      !selectedFeatures.length
    ) {
      return;
    }

    const aoi: FeatureCollection<Polygon> = {
      type: 'FeatureCollection',
      features: selectedFeatures
    };

    const { start, end } = selectedInterval;

    requestDatasetTimeseriesData({
      start,
      end,
      aoi,
      dataset,
      queryClient,
      concurrencyManager: analysisConcurrencyManager,
      onProgress: (data) => {
        setAnalysis(data);
      }
    });
    // We want great control when this effect run which is done by incrementing
    // the analysisRun. This is done when the user refreshes the analysis or
    // when they enter the analysis. It is certain that when this effect runs
    // the other values will be up to date. Adding all dependencies would cause
    // the hook to continuously run.
  }, [analysisRun, datasetStatus]);
}

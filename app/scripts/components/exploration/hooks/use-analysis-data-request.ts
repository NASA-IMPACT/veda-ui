import { useQueryClient } from '@tanstack/react-query';
import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';
import { useCallback, useEffect } from 'react';
import { requestDatasetTimeseriesData } from '../analysis-data';
import { analysisControllerAtom, selectedIntervalAtom } from '../atoms/atoms';
import { useTimelineDatasetAnalysis } from '../atoms/hooks';
import { analysisConcurrencyManager } from '../concurrency';
import { TimelineDataset, TimelineDatasetStatus } from '../types.d.ts';

// 🛑 Temporary!!! Use map data
const aoi: any = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'world',
      properties: {},
      geometry: {
        coordinates: [
          [
            [-180, -89],
            [180, -89],
            [180, 89],
            [-180, 89],
            [-180, -89]
          ]
        ],
        type: 'Polygon'
      }
    }
  ]
};

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
  const { analysisRun } = useAnalysisController();

  const dataset = useAtomValue(datasetAtom);
  const datasetStatus = dataset.status;

  const [, setAnalysis] = useTimelineDatasetAnalysis(datasetAtom);

  useEffect(() => {
    if (datasetStatus !== TimelineDatasetStatus.SUCCESS || !selectedInterval) {
      return;
    }

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

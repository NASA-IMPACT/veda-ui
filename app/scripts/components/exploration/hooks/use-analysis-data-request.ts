import { useState, useCallback, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { FeatureCollection, Polygon } from 'geojson';
import { PrimitiveAtom, useAtom, useAtomValue } from 'jotai';

import { requestDatasetTimeseriesData } from '../analysis-data';
import { analysisControllerAtom } from '../atoms/analysis';
import { selectedIntervalAtom } from '../atoms/dates';
import { useTimelineDatasetAnalysis } from '../atoms/hooks';
import { analysisConcurrencyManager } from '../concurrency';
import { TimelineDataset, TimelineDatasetAnalysis, TimelineDatasetStatus } from '../types.d.ts';
import { MAX_QUERY_NUM } from '../constants';
import useAois from '$components/common/map/controls/hooks/use-aois';

export function useAnalysisController() {
  const [controller, setController] = useAtom(analysisControllerAtom);

  return {
    isAnalyzing: controller.isAnalyzing,
    isObsolete: controller.isObsolete,
    setObsolete: useCallback(
      () => setController((v) => ({ ...v, isObsolete: true })),
      [] // eslint-disable-line react-hooks/exhaustive-deps -- setController is stable
    ),
    runAnalysis: useCallback(
      (datasetsIds) => {
        const ids = Array.isArray(datasetsIds) ? datasetsIds : [datasetsIds];
        setController((v) => ({
          ...v,
          // Increment each id count by 1
          runIds: ids.reduce(
            (acc, id) => ({ ...acc, [id]: (acc[id] ?? 0) + 1 }),
            v.runIds
          ),
          isAnalyzing: true,
          isObsolete: false
        }));
      },
      [] // eslint-disable-line react-hooks/exhaustive-deps -- setController is stable
    ),
    cancelAnalysis: useCallback(
      () =>
        setController((v) => ({
          ...v,
          isAnalyzing: false,
          isObsolete: false
        })),
      [] // eslint-disable-line react-hooks/exhaustive-deps -- setController is stable
    ),
    getRunId: (id: string) => controller.runIds[id] ?? 0,
    reset: useCallback(
      () =>
        setController(() => ({
          isAnalyzing: false,
          runIds: {},
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

  const { getRunId, isAnalyzing } = useAnalysisController();

  const dataset = useAtomValue(datasetAtom);
  const datasetStatus = dataset.status;

  const setAnalysis = useTimelineDatasetAnalysis(datasetAtom);

  const analysisRunId = getRunId(dataset.data.id);
  
  const [analysisResult, setAnalysisResult] = useState<TimelineDatasetAnalysis>({
    status: TimelineDatasetStatus.IDLE,
    error: null,
    data: null,
    meta: {}
  });


  useEffect(() => {
    if (!isAnalyzing) {
      queryClient.cancelQueries({
        queryKey: ['analysis'],
        fetchStatus: 'fetching'
      });
      analysisConcurrencyManager.clear();
    }
  }, [isAnalyzing]);

  useEffect(() => {
    if (
      !isAnalyzing ||
      datasetStatus !== TimelineDatasetStatus.SUCCESS ||
      !selectedInterval ||
      !selectedFeatures.length ||
      analysisRunId === 0 // Avoid running the analysis on the first render
    ) {
      return;
    }

    const aoi: FeatureCollection<Polygon> = {
      type: 'FeatureCollection',
      features: selectedFeatures
    };
    const { start, end } = selectedInterval;
      (async () => {
        const stat = await requestDatasetTimeseriesData({
        maxItems: MAX_QUERY_NUM,
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
      setAnalysisResult(stat);
    })();
    // We want great control when this effect run which is done by incrementing
    // the analysisRun. This is done when the user refreshes the analysis or
    // when they enter the analysis. It is certain that when this effect runs
    // the other values will be up to date. Adding all dependencies would cause
    // the hook to continuously run.
  }, [analysisRunId, datasetStatus, isAnalyzing]);


  useEffect(() => {
    // @TECH-DEBT
    // The `setAnalysis` function is designed to update the Jotai Atom's state to reflect the progress of an analysis operation, ideally moving through 'idle', 'loading', and finally 'success' states. However, the function fails to accurately transition between these states. Specifically, it bypasses the expected incremental 'loading' updates and may incorrectly remain in a 'loading' state even after the analysis has successfully completed. This behavior leads to a discrepancy between the actual analysis status and the state represented in the UI, potentially confusing users and undermining the UI's reliability. 
    // The function currently attempts to rectify this by overwriting the Atom's value with the final result, ensuring the state accurately reflects the analysis outcome. This workaround does not address the root cause of the flawed state transitions. A revision of the state management logic is needed to ensure the Atom's state progresses correctly and reflects the actual status of the analysis process.
    setAnalysis(analysisResult);
  },[setAnalysis, analysisResult]);

}

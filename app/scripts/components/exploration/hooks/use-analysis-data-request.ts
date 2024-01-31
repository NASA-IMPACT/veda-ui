import { useCallback, useState, useEffect } from 'react';
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
  const [analysisResult, setAnalysisResult] = useState<TimelineDatasetAnalysis>({
    status: TimelineDatasetStatus.IDLE,
    error: null,
    data: null,
    meta: {}
  });

  const { getRunId, isAnalyzing } = useAnalysisController();

  const dataset = useAtomValue(datasetAtom);
  const datasetStatus = dataset.status;

  const setAnalysis = useTimelineDatasetAnalysis(datasetAtom);

  const analysisRunId = getRunId(dataset.data.id);

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
    async function makeCall(){
      const analysisResult = await requestDatasetTimeseriesData({
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
      setAnalysisResult(analysisResult);
    }
    makeCall();
    // We want great control when this effect run which is done by incrementing
    // the analysisRun. This is done when the user refreshes the analysis or
    // when they enter the analysis. It is certain that when this effect runs
    // the other values will be up to date. Adding all dependencies would cause
    // the hook to continuously run.
  }, [analysisRunId, datasetStatus, isAnalyzing]);

  useEffect(() => {
    // setAnalysis sets Jotai Atom value for analysis result
    // However, it is not setting the value correctly, 
    // ended up loading status as a result even when the request is successful.
    // This make sure the analysis result with the final result of analysis,
    // so Jotai value gets the right value in the end
    setAnalysis(analysisResult);
  },[setAnalysis, analysisResult]);

}

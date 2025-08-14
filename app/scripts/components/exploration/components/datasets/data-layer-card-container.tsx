import React, { useRef, useState } from 'react';
import { PrimitiveAtom, useAtom } from 'jotai';
import DataLayerCardPresentational from './data-layer-card-presentational';
import {
  LayerLegendCategorical,
  LayerLegendGradient,
  LayerLegendText
} from '$types/veda';
import useParentDataset from '$components/exploration/hooks/use-parent-data';
import { TimelineDataset } from '$components/exploration/types.d.ts';
import { timelineDatasetsAtom } from '$components/exploration/atoms/datasets';
import {
  useTimelineDatasetSettings,
  useTimelineDatasetVisibility,
  useTimelineDatasetColormap,
  useTimelineDatasetColormapScale
} from '$components/exploration/atoms/hooks';

interface CardProps {
  dataset: TimelineDataset;
  datasetAtom: PrimitiveAtom<TimelineDataset>;
  onClickLayerInfo: () => void;
  datasetLegend:
    | LayerLegendCategorical
    | LayerLegendGradient
    | LayerLegendText
    | undefined;
}

export default function DataLayerCardContainer(props: CardProps) {
  const { dataset, datasetAtom, datasetLegend, onClickLayerInfo } = props;

  // All atom-based state management
  const [datasets, setDatasets] = useAtom(timelineDatasetsAtom);
  const [getSettings, setSetting] = useTimelineDatasetSettings(datasetAtom);
  const [isVisible, setVisible] = useTimelineDatasetVisibility(datasetAtom);
  const [colorMap, setColorMap] = useTimelineDatasetColormap(datasetAtom);
  const [colorMapScale, setColorMapScale] =
    useTimelineDatasetColormapScale(datasetAtom);
  const opacity = (getSettings('opacity') ?? 100) as number;

  const layerInfo = dataset.data.info;
  const [min, max] =
    datasetLegend?.type === 'gradient' &&
    datasetLegend.min != null &&
    datasetLegend.max != null
      ? ([datasetLegend.min, datasetLegend.max] as [number, number])
      : dataset.data.sourceParams?.rescale || [0, 1];

  const { parentDataset } = useParentDataset({
    datasetId: dataset.data.parentDataset.id
  });

  const showLoadingConfigurableCmapSkeleton =
    dataset.status === 'loading' && datasetLegend?.type === 'gradient';
  const showConfigurableCmap = (dataset.status === 'success' &&
    dataset.data.type !== 'wmts' &&
    dataset.data.type !== 'wms' &&
    datasetLegend?.type === 'gradient' &&
    colorMap) as boolean;

  const showNonConfigurableCmap =
    !showConfigurableCmap &&
    !showLoadingConfigurableCmapSkeleton &&
    datasetLegend?.type === 'gradient';

  const currentIndex = datasets.findIndex((d) => d.data.id === dataset.data.id);

  const handleRemoveLayer = () => {
    setDatasets((prevDatasets) =>
      prevDatasets.filter((d) => d.data.id !== dataset.data.id)
    );
  };

  const handleMoveUp = () => {
    if (currentIndex > 0) {
      setDatasets((prevDatasets) => {
        const arr = [...prevDatasets];
        [arr[currentIndex], arr[currentIndex - 1]] = [
          arr[currentIndex - 1],
          arr[currentIndex]
        ];
        return arr;
      });
    }
  };

  const handleMoveDown = () => {
    if (currentIndex < datasets.length - 1) {
      setDatasets((prevDatasets) => {
        const arr = [...prevDatasets];
        [arr[currentIndex], arr[currentIndex + 1]] = [
          arr[currentIndex + 1],
          arr[currentIndex]
        ];
        return arr;
      });
    }
  };

  const handleOpacityChange = (newOpacity: number) => {
    setSetting('opacity', newOpacity);
  };

  return (
    <DataLayerCardPresentational
      dataset={dataset}
      isVisible={isVisible}
      setVisible={setVisible}
      colorMap={colorMap}
      setColorMap={setColorMap}
      colorMapScale={colorMapScale}
      setColorMapScale={setColorMapScale}
      datasetLegend={datasetLegend}
      onClickLayerInfo={onClickLayerInfo}
      layerInfo={layerInfo}
      min={min}
      max={max}
      parentDataset={parentDataset}
      showLoadingConfigurableCmapSkeleton={showLoadingConfigurableCmapSkeleton}
      showConfigurableCmap={showConfigurableCmap}
      showNonConfigurableCmap={showNonConfigurableCmap}
      onRemoveLayer={handleRemoveLayer}
      onMoveUp={handleMoveUp}
      onMoveDown={handleMoveDown}
      canMoveUp={currentIndex > 0}
      canMoveDown={currentIndex < datasets.length - 1}
      opacity={opacity}
      onOpacityChange={handleOpacityChange}
    />
  );
}

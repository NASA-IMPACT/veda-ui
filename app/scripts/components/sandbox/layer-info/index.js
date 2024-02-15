import React, { useState, useCallback } from 'react';
import { datasets } from 'veda';
import LayerInfoModal from '$components/exploration/components/layer-info-modal';
import Block from '$components/common/blocks';
import { ContentBlockProse } from '$styles/content-block';

const selectedDatasetId = 'no2';

export default function SandboxMDXPage() {
  const [revealed, setRevealed] = useState(false);

  const openModal = useCallback(() => setRevealed(true), []);
  const closeModal = useCallback(() => setRevealed(false), []);

  const datasetData = datasets[selectedDatasetId]?.data;
  const layerData = datasetData.layers[0];

  const modalData = {
    name: layerData.name,
    info: layerData.info,
    parentData: {
      id: datasetData.id,
      infoDescription: datasetData.infoDescription
    }
  };

  return datasetData && datasetData.infoDescription && layerData.info ? (
    <>
      <Block>
        <ContentBlockProse>
          <button type='button' onClick={openModal}>
            Open {datasetData.name} Layer Information Modal
          </button>
          {revealed && (
            <LayerInfoModal
              revealed={revealed}
              close={closeModal}
              layerData={modalData}
            />
          )}
        </ContentBlockProse>
      </Block>
      <Block>
        <ContentBlockProse>
          <h4> Templated layer info</h4>
          {Object.keys(layerData.info).map((key, idx, arr) => {
            const currentValue = layerData.info[key];
            return idx !== arr.length - 1 ? (
              <span>{currentValue} · </span>
            ) : (
              <span>{currentValue} </span>
            );
          })}
        </ContentBlockProse>
      </Block>
    </>
  ) : (
    <div> Cannot find dataset info from {selectedDatasetId}</div>
  );
}

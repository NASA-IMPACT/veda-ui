import React, { useState, useCallback } from 'react';
import { datasets } from 'veda';
import LayerInfoModal from '$components/exploration/components/layer-info-modal';
import Block from '$components/common/blocks';
import { ContentBlockProse } from '$styles/content-block';

export default function SandboxMDXPage() {
  const [revealed, setRevealed] = useState(false);

  const openModal = useCallback(() => setRevealed(true), []);
  const closeModal = useCallback(() => setRevealed(false), []);

  const layer = datasets['no2'].data.layers[0];
  return layer && layer.info ? (
    <>
      <Block>
        <ContentBlockProse>
          <button type='button' onClick={openModal}>
            Open {layer.name} Layer Information Modal
          </button>
          {revealed && (
            <LayerInfoModal
              revealed={revealed}
              close={closeModal}
              datasetLayer={layer}
            />
          )}
        </ContentBlockProse>
      </Block>
      <Block>
        <ContentBlockProse>
          <h4> Templated layer info</h4>
          {Object.keys(layer.info.template).map((key, idx, arr) => {
            const currentValue = layer.info.template[key];
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
    <div> Cannot find layer info fron dataset no2</div>
  );
}

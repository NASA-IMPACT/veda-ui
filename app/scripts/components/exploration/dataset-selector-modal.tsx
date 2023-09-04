import React, { useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import { useAtom } from 'jotai';

import { Modal } from '@devseed-ui/modal';
import { media, themeVal } from '@devseed-ui/theme-provider';
import { Form, FormCheckable } from '@devseed-ui/form';
import { Overline } from '@devseed-ui/typography';
import { Button } from '@devseed-ui/button';

import { timelineDatasetsAtom } from './atoms';
import {
  datasetLayers,
  findParentDataset,
  reconcileDatasets
} from './data-utils';

import { variableGlsp } from '$styles/variable-utils';

const CheckableGroup = styled.div`
  display: grid;
  gap: ${variableGlsp(0.5)};
  grid-template-columns: repeat(2, 1fr);
  background: ${themeVal('color.surface')};

  ${media.mediumUp`
    grid-template-columns: repeat(3, 1fr);
  `}

  ${media.xlargeUp`
    grid-template-columns: repeat(4, 1fr);
  `}
`;

const FormCheckableCustom = styled(FormCheckable)`
  padding: ${variableGlsp(0.5)};
  background: ${themeVal('color.surface')};
  box-shadow: 0 0 0 1px ${themeVal('color.base-100a')};
  border-radius: ${themeVal('shape.rounded')};
  align-items: center;
`;

interface DatasetSelectorModalProps {
  revealed: boolean;
  close: () => void;
}

export function DatasetSelectorModal(props: DatasetSelectorModalProps) {
  const { revealed, close } = props;

  const [datasets, setDatasets] = useAtom(timelineDatasetsAtom);

  // Store a list of selected datasets and only confirm on save.
  const [selectedIds, setSelectedIds] = useState<string[]>(
    datasets.map((dataset) => dataset.data.id)
  );

  useEffect(() => {
    setSelectedIds(datasets.map((dataset) => dataset.data.id));
  }, [datasets]);

  const onCheck = useCallback((id) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  }, []);

  const onConfirm = useCallback(() => {
    // Reconcile selectedIds with datasets.
    setDatasets(reconcileDatasets(selectedIds, datasetLayers, datasets));
    close();
  }, [close, selectedIds, datasets, setDatasets]);

  return (
    <Modal
      id='modal'
      size='xlarge'
      title='Select datasets'
      revealed={revealed}
      closeButton={false}
      content={
        <>
          <Form>
            <CheckableGroup>
              {datasetLayers.map((datasetLayer) => (
                <FormCheckableCustom
                  key={datasetLayer.id}
                  id={datasetLayer.id}
                  name={datasetLayer.id}
                  value={datasetLayer.id}
                  textPlacement='right'
                  type='checkbox'
                  onChange={() => onCheck(datasetLayer.id)}
                  checked={selectedIds.includes(datasetLayer.id)}
                >
                  <Overline>
                    From: {findParentDataset(datasetLayer.id)?.name}
                  </Overline>
                  {datasetLayer.name}
                </FormCheckableCustom>
              ))}
            </CheckableGroup>
          </Form>
        </>
      }
      footerContent={
        <Button
          variation='primary-fill'
          disabled={!selectedIds.length}
          onClick={onConfirm}
        >
          Select {selectedIds.length} datasets
        </Button>
      }
    />
  );
}

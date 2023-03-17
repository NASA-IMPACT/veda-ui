import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { multiply, themeVal } from '@devseed-ui/theme-provider';
import { Button, ButtonProps } from '@devseed-ui/button';
import { CollecticonCode } from '@devseed-ui/collecticons';
import { Modal } from '@devseed-ui/modal';
import { DatasetData, datasets, VedaDatum } from 'veda/thematics';

import { HintedError } from '$utils/hinted-error';
import { variableGlsp } from '$styles/variable-utils';

interface NotebookConnectButtonProps {
  compact?: boolean;
  variation?: ButtonProps['variation'];
  size?: ButtonProps['size'];
  dataset?: VedaDatum<DatasetData>;
  className?: string;
}

function NotebookConnectButtonSelf(props: NotebookConnectButtonProps) {
  const {
    className,
    compact = true,
    variation = 'primary-fill',
    size = 'medium',
    dataset
  } = props;

  const [revealed, setRevealed] = useState(false);
  const close = useCallback(() => setRevealed(false), []);

  const datasetUsages = dataset?.data.usage;

  if (!datasetUsages) {
    return null;
  }

  const layerIdsSet = dataset.data.layers.reduce(
    (acc, layer) => acc.add(layer.stacCol),
    new Set<string>()
  );

  return (
    <>
      <Button
        className={className}
        type='button'
        variation={variation}
        fitting={compact ? 'skinny' : 'regular'}
        onClick={() => setRevealed(true)}
        size={size}
      >
        <CollecticonCode meaningful={compact} title='Open data usage options' />
        {compact ? '' : 'Analyze data (Python)'}
      </Button>
      <Modal
        id='modal'
        size='medium'
        title='Data usage'
        revealed={revealed}
        onCloseClick={close}
        onOverlayClick={close}
        closeButton
        content={
          <>
            <p>Check out how to use this dataset:</p>
            <ul>
              {datasetUsages.map((datasetUsage) => (
                <li key={datasetUsage.url}>
                  {datasetUsage.label}:{' '}
                  <a href={datasetUsage.url}>{datasetUsage.title}</a>
                </li>
              ))}
            </ul>
            <p>
              For reference, the following STAC collection ID&apos;s are
              associated with this dataset:
            </p>
            <ul>
              {Array.from(layerIdsSet).map((id) => (
                <li key={id}>
                  <code>{id}</code>
                </li>
              ))}
            </ul>
          </>
        }
      />
    </>
  );
}

export const NotebookConnectButton = styled(NotebookConnectButtonSelf)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;

interface NotebookConnectCalloutProps {
  children: React.ReactNode;
  datasetId: string;
  className?: string;
}

function NotebookConnectCalloutSelf(props: NotebookConnectCalloutProps) {
  const { children, datasetId, className } = props;

  if (!datasetId) {
    throw new HintedError('Malformed Map Block', [
      'Missing property: datasetId'
    ]);
  }

  const dataset = datasets[datasetId];

  if (!dataset) {
    throw new HintedError('Malformed Map Block', [
      `Dataset not found: ${datasetId}`
    ]);
  }

  if (!dataset.data.usage?.length) {
    throw new HintedError('Malformed Map Block', [
      `Dataset does not have 'usage' defined: ${datasetId}`
    ]);
  }

  return (
    <div className={className}>
      <div>{children}</div>
      <NotebookConnectButton
        // compact={false}
        variation='base-outline'
        dataset={dataset}
      />
    </div>
  );
}

export const NotebookConnectCalloutBlock = styled(NotebookConnectCalloutSelf)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
  display: flex;
  flex-flow: row nowrap;
  border-radius: ${multiply(themeVal('shape.rounded'), 2)};
  background: ${themeVal('color.base-50')};
  padding: ${variableGlsp()};
  gap: ${variableGlsp()};
  box-shadow: inset 0 -1px 0 0 ${themeVal('color.base-50a')};

  ${NotebookConnectButton} {
    margin-left: auto;
  }
`;

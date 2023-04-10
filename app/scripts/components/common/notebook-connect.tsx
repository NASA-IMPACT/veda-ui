import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { media, multiply, themeVal } from '@devseed-ui/theme-provider';
import { Button, ButtonProps } from '@devseed-ui/button';
import {
  CollecticonBook,
  CollecticonCode,
  CollecticonCog
} from '@devseed-ui/collecticons';
import { Modal } from '@devseed-ui/modal';
import { DatasetData, datasets, VedaDatum } from 'veda';

import { HintedError } from '$utils/hinted-error';
import { variableGlsp } from '$styles/variable-utils';

interface NotebookConnectButtonProps {
  compact?: boolean;
  variation?: ButtonProps['variation'];
  size?: ButtonProps['size'];
  dataset?: VedaDatum<DatasetData>;
  className?: string;
}

const DatasetUsages = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${variableGlsp()};
  margin-bottom: ${variableGlsp()};
  list-style-type: none;
  padding: 0;

  ${media.smallUp`
    grid-template-columns: 1fr 1fr;
  `}
`;

const DatasetUsageLink = styled.a`
  display: flex;
  padding: ${variableGlsp()};
  text-decoration: none;
  color: ${themeVal('color.primary')};
  border-radius: ${themeVal('shape.rounded')};
  background: ${themeVal('color.primary-50')};
  outline: 0 solid transparent;
  transition: transform 0.24s ease-in-out 0s, outline-width 0.16s ease-in-out 0s;

  & > svg {
    flex: 0 0 auto;
    margin: 0.25rem 0.5rem 0 0;
  }

  &:visited {
    color: ${themeVal('color.primary')};
  }

  &:hover {
    transform: translate(0, 0.125rem);
  }

  &:focus-visible {
    outline-width: 0.25rem;
    outline-color: ${themeVal('color.primary')};
  }

  &:focus:not(:focus-visible) {
    outline: 0;
  }
`;

const DatasetUsageLabel = styled.div`
  & > h4 {
    font-weight: normal;
  }

  & > p {
    color: ${themeVal('color.base')};
    font-size: 0.875rem;
  }
`;

type DatasetUsageType = 'jupyter' | 'github' | 'unknown';

const IconByType: Record<DatasetUsageType, any> = {
  jupyter: <CollecticonCog />,
  github: <CollecticonBook />,
  unknown: <CollecticonCog />
};

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

  const datasetUsagesWithIcon = useMemo(() => {
    return datasetUsages?.map((d) => {
      let type = 'unknown';
      if (d.url.match('nasa-veda.2i2c.cloud')) type = 'jupyter';
      else if (d.url.match('github.com/NASA-IMPACT/veda-docs')) type = 'github';
      return {
        ...d,
        type
      };
    });
  }, [datasetUsages]);

  if (!datasetUsages || !datasetUsagesWithIcon) {
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
        title='How to use this dataset'
        revealed={revealed}
        onCloseClick={close}
        onOverlayClick={close}
        closeButton
        content={
          <>
            <DatasetUsages>
              {datasetUsagesWithIcon.map((datasetUsage) => (
                <li key={datasetUsage.url}>
                  <DatasetUsageLink href={datasetUsage.url}>
                    {IconByType[datasetUsage.type]}
                    <DatasetUsageLabel>
                      <h4>{datasetUsage.title}</h4>
                      <p>{datasetUsage.label}</p>
                    </DatasetUsageLabel>
                  </DatasetUsageLink>
                </li>
              ))}
            </DatasetUsages>
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

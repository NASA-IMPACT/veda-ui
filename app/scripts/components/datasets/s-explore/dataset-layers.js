import React, { useMemo } from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';
import {
  glsp,
  listReset,
  themeVal,
  truncated
} from '@devseed-ui/theme-provider';
import { AccordionManager, AccordionFold } from '@devseed-ui/accordion';
import { CollecticonCircleInformation } from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';
import { ElementInteractive } from '$components/common/element-interactive';
import { VarProse } from '$styles/variable-components';
import { variableGlsp } from '$styles/variable-utils';

import { checkLayerLoadStatus } from '$components/common/mapbox/layers/utils';

const LayerList = styled.ol`
  ${listReset()};
`;

export default function DatasetLayers(props) {
  const { asyncLayers, onAction, selectedLayerId } = props;

  // A layer is considered ready when its data and the compare layer data
  // (if any) is also loaded.
  const layersStatuses = useMemo(() => {
    return asyncLayers.reduce(
      (acc, l) => {
        switch (checkLayerLoadStatus(l)) {
          case 'succeeded':
            acc[0].push(l);
            break;
          case 'loading':
            acc[1].push(l);
            break;
          case 'failed':
            acc[2].push(l);
            break;
        }

        return acc;
      },
      [
        // Ready
        [],
        // Loading
        [],
        // Error
        []
      ]
    );
  }, [asyncLayers]);

  const [lReady, lLoading, lError] = layersStatuses;

  return (
    <AccordionManager allowMultiple>
      {!!lLoading.length && <p>{lLoading.length} are loading</p>}

      {!!lError.length && <p>{lError.length} errored</p>}

      {!!lReady.length && (
        <LayerList>
          {lReady.map(({ baseLayer }) => (
            <li key={baseLayer.data.id}>
              <Layer
                id={baseLayer.data.id}
                name={baseLayer.data.name}
                info={baseLayer.data.description}
                active={baseLayer.data.id === selectedLayerId}
                onToggleClick={() => onAction('layer.toggle', baseLayer.data)}
              />
            </li>
          ))}
        </LayerList>
      )}
    </AccordionManager>
  );
}

DatasetLayers.propTypes = {
  asyncLayers: T.array,
  onAction: T.func,
  selectedLayerId: T.string
};

const LayerSelf = styled.article`
  position: relative;
  border-radius: 0;
  margin-left: ${variableGlsp(-1)};
  margin-right: ${variableGlsp(-1)};
  padding-left: ${variableGlsp()};
  padding-right: ${variableGlsp()};

  > div {
    background: none;
  }

  > *:not(a) {
    position: relative;
    z-index: 2;
    pointer-events: none;
  }

  a,
  button {
    pointer-events: auto;
  }

  &::before {
    content: '';
    background: ${themeVal('color.primary')};
    position: absolute;
    left: 0;
    width: 0;
    height: 100%;
    transition: width 240ms ease-in-out;
  }

  ${({ isStateOver }) =>
    isStateOver &&
    css`
      background: ${themeVal('color.base-50a')};
    `}

  ${({ isSelected }) =>
    isSelected &&
    css`
      background: ${themeVal('color.base-100a')};

      &::before {
        width: ${glsp(0.25)};
      }
    `}
`;

const LayerHeader = styled.header`
  display: grid;
  grid-auto-columns: 1fr min-content;
  padding: ${glsp(0.5, 0)};
  grid-gap: ${glsp(0.5)};
`;

const LayerHeadline = styled.div`
  grid-row: 1;
  min-width: 0px;
`;

const LayerTitle = styled.h1`
  ${truncated()}
  font-size: 1rem;
  line-height: 1.25rem;
  margin: 0;

  sub {
    bottom: 0;
  }
`;

const LayerToolbar = styled.div`
  grid-row: 1;
  display: flex;
  flex-flow: row nowrap;
  align-items: flex-start;

  > * {
    margin-top: -0.125rem;
  }

  > *:not(:first-child) {
    margin-left: ${glsp(0.25)};
  }
`;

const LayerBodyInner = styled(VarProse)`
  position: relative;
  z-index: 8;
  box-shadow: inset 0 1px 0 0 ${themeVal('color.base-100a')};
  background: rgba(255, 255, 255, 0.02);
  font-size: 0.875rem;
  line-height: 1.25rem;
  backdrop-filter: saturate(48%);
  padding: ${glsp()};

  /* stylelint-disable-next-line no-descending-specificity */
  > * {
    margin-bottom: ${glsp(0.75)};
  }
`;

function Layer(props) {
  const { id, name, info, active, onToggleClick } = props;

  return (
    <ElementInteractive
      as={LayerSelf}
      isSelected={active}
      linkLabel='Toggle layer'
      linkProps={{
        href: '#',
        onClick: (e) => {
          e.preventDefault();
          onToggleClick();
        }
      }}
    >
      <AccordionFold
        id={`layer-${id}`}
        forwardedAs='div'
        renderHeader={({ isExpanded, toggleExpanded }) => (
          <LayerHeader>
            <LayerHeadline>
              <LayerTitle>{name}</LayerTitle>
            </LayerHeadline>
            <LayerToolbar>
              <Button
                variation='base-text'
                fitting='skinny'
                // disabled={!info}
                active={isExpanded}
                onClick={toggleExpanded}
              >
                <CollecticonCircleInformation
                  title='Information about layer'
                  meaningful
                />
              </Button>
            </LayerToolbar>
          </LayerHeader>
        )}
        renderBody={() => (
          <LayerBodyInner>
            {info || <p>No info available for this layer.</p>}
          </LayerBodyInner>
        )}
      />
    </ElementInteractive>
  );
}

Layer.propTypes = {
  id: T.string,
  name: T.string,
  info: T.node,
  active: T.bool,
  onToggleClick: T.func
};

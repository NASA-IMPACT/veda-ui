import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAtom } from 'jotai';

import { DatasetData, DatasetLayer, datasetTaxonomies } from 'veda';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalHeadline
} from '@devseed-ui/modal';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Heading, Subtitle } from '@devseed-ui/typography';
import {
  CollecticonTickSmall,
  CollecticonXmarkSmall,
  iconDataURI
} from '@devseed-ui/collecticons';

import { timelineDatasetsAtom } from '../atoms/atoms';
import {
  allDatasets,
  datasetLayers,
  findParentDataset,
  reconcileDatasets
} from '../data-utils';

import EmptyHub from '$components/common/empty-hub';
import {
  Card,
  CardList,
  CardMeta,
  CardTopicsList
} from '$components/common/card';
import { DatasetClassification } from '$components/common/dataset-classification';
import { CardSourcesList } from '$components/common/card-sources';
import DatasetMenu from '$components/data-catalog/dataset-menu';
import { getDatasetPath } from '$utils/routes';
import {
  getTaxonomy,
  TAXONOMY_SOURCE,
  TAXONOMY_TOPICS
} from '$utils/veda-data';
import { Pill } from '$styles/pill';
import BrowseControls from '$components/common/browse-controls';
import {
  Actions,
  useBrowserControls
} from '$components/common/browse-controls/use-browse-controls';
import { prepareDatasets, sortOptions } from '$components/data-catalog';
import Pluralize from '$utils/pluralize';

const DatasetModal = styled(Modal)`
  z-index: ${themeVal('zIndices.modal')};

  /* Override ModalContents */
  > div {
    display: flex;
    flex-flow: column;
  }

  ${ModalHeader} {
    position: sticky;
    top: ${glsp(-2)};
    z-index: 100;
    box-shadow: 0 1px 0 0 ${themeVal('color.base-100a')};
    margin-bottom: ${glsp(2)};
  }

  ${ModalBody} {
    height: 100%;
    min-height: 0;
    display: flex;
    flex-flow: column;
    gap: ${glsp(1)};
  }

  ${ModalFooter} {
    display: flex;
    gap: ${glsp(1)};
    align-items: center;
    position: sticky;
    bottom: ${glsp(-2)};
    z-index: 100;
    box-shadow: 0 -1px 0 0 ${themeVal('color.base-100a')};

    > .selection-info {
      margin-right: auto;
    }
  }
`;

const ModalIntro = styled.div``;

const DatasetCount = styled(Subtitle)`
  display: flex;
  gap: ${glsp(0.5)};

  span {
    text-transform: uppercase;
    line-height: 1.5rem;
  }
`;

const DatasetContainer = styled.div`
  height: 100%;
  min-height: 0;
  display: flex;
  margin-bottom: ${glsp(2)};

  ${CardList} {
    width: 100%;
  }

  ${EmptyHub} {
    flex-grow: 1;
  }
`;

const LayerCard = styled(Card)<{ checked: boolean }>`
  outline: 4px solid transparent;
  ${({ checked }) =>
    checked &&
    css`
      outline-color: ${themeVal('color.primary')};
    `}

  &:hover {
    &::before,
    &::after {
      opacity: 1;
    }
  }

  &::before,
  &::after {
    display: block;
    content: '';
    position: absolute;
    transition: opacity 320ms ease-in-out;
    opacity: 0.32;
  }

  &::before {
    top: 0;
    right: 0;
    width: 4rem;
    height: 4rem;
    clip-path: polygon(0 0, 100% 0, 100% 100%);
    background: ${themeVal('color.primary')};
  }

  &::after {
    top: 0.25rem;
    right: 0.25rem;
    width: 1.5rem;
    height: 1.5rem;
    background-image: url(${({ theme }) =>
      iconDataURI(CollecticonTickSmall, {
        color: theme.color?.surface,
        size: 'large'
      })});
  }

  ${({ checked }) =>
    checked &&
    css`
      &::before,
      &::after {
        opacity: 1;
      }
    `}
`;

interface DatasetSelectorModalProps {
  revealed: boolean;
  close: () => void;
}

export function DatasetSelectorModal(props: DatasetSelectorModalProps) {
  const { revealed, close } = props;

  const [timelineDatasets, setTimelineDatasets] = useAtom(timelineDatasetsAtom);

  // Store a list of selected datasets and only confirm on save.
  const [selectedIds, setSelectedIds] = useState<string[]>(
    timelineDatasets.map((dataset) => dataset.data.id)
  );

  useEffect(() => {
    setSelectedIds(timelineDatasets.map((dataset) => dataset.data.id));
  }, [timelineDatasets]);

  const onCheck = useCallback((id) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]
    );
  }, []);

  const onConfirm = useCallback(() => {
    // Reconcile selectedIds with datasets.
    setTimelineDatasets(
      reconcileDatasets(selectedIds, datasetLayers, timelineDatasets)
    );
    close();
  }, [close, selectedIds, timelineDatasets, setTimelineDatasets]);

  const controlVars = useBrowserControls({
    sortOptions
  });
  const { taxonomies, sortField, sortDir, onAction } = controlVars;
  const search = controlVars.search ?? '';

  // Clear filters when the modal is revealed.
  useEffect(() => {
    if (revealed) {
      onAction(Actions.CLEAR);
    }
  }, [revealed]);

  // Filters are applies to the veda datasets, but then we want to display the
  // dataset layers since those are shown on the map.
  const displayDatasetLayers = useMemo(
    () =>
      prepareDatasets(allDatasets, {
        search,
        taxonomies,
        sortField,
        sortDir
      }).flatMap((dataset) => dataset.layers),
    [search, taxonomies, sortField, sortDir]
  );

  const isFiltering = !!(
    (taxonomies && Object.keys(taxonomies).length) ||
    search
  );

  const isFirstSelection = timelineDatasets.length === 0;

  return (
    <DatasetModal
      id='modal'
      size='xlarge'
      title='Select datasets'
      revealed={revealed}
      closeButton={!isFirstSelection}
      onCloseClick={close}
      renderHeadline={() => (
        <ModalHeadline>
          <Heading size='small'>Select datasets</Heading>
          <ModalIntro>
            {isFirstSelection ? (
              <p>Select datasets to start the exploration.</p>
            ) : (
              <p>Add or remove datasets to the exploration.</p>
            )}
          </ModalIntro>
        </ModalHeadline>
      )}
      content={
        <>
          <BrowseControls
            {...controlVars}
            taxonomiesOptions={datasetTaxonomies}
            sortOptions={sortOptions}
          />
          <DatasetCount>
            <span>
              Showing{' '}
              <Pluralize
                singular='dataset'
                plural='datasets'
                count={displayDatasetLayers.length}
                showCount={true}
              />{' '}
              out of {datasetLayers.length}.
            </span>
            {isFiltering && (
              <Button size='small' onClick={() => onAction(Actions.CLEAR)}>
                Clear filters <CollecticonXmarkSmall />
              </Button>
            )}
          </DatasetCount>

          <DatasetContainer>
            {displayDatasetLayers.length ? (
              <CardList>
                {displayDatasetLayers.map((datasetLayer) => {
                  const parent = findParentDataset(datasetLayer.id);
                  if (!parent) return null;

                  return (
                    <li key={datasetLayer.id}>
                      <DatasetLayerCard
                        layer={datasetLayer}
                        parent={parent}
                        selected={selectedIds.includes(datasetLayer.id)}
                        onDatasetClick={() => onCheck(datasetLayer.id)}
                      />
                    </li>
                  );
                })}
              </CardList>
            ) : (
              <EmptyHub>
                There are no datasets to show with the selected filters.
              </EmptyHub>
            )}
          </DatasetContainer>
        </>
      }
      footerContent={
        <>
          <p className='selection-info'>
            {selectedIds.length
              ? `${selectedIds.length} out of ${datasetLayers.length} datasets selected.`
              : 'No datasets selected.'}
          </p>
          {!isFirstSelection && (
            <Button variation='base-text' onClick={close}>
              Cancel
            </Button>
          )}
          <Button
            variation='primary-fill'
            disabled={!selectedIds.length}
            onClick={onConfirm}
          >
            Confirm
          </Button>
        </>
      }
    />
  );
}

interface DatasetLayerProps {
  parent: DatasetData;
  layer: DatasetLayer;
  selected: boolean;
  onDatasetClick: () => void;
}

function DatasetLayerCard(props: DatasetLayerProps) {
  const { parent, layer, onDatasetClick, selected } = props;

  const topics = getTaxonomy(parent, TAXONOMY_TOPICS)?.values;

  return (
    <LayerCard
      cardType='cover'
      checked={selected}
      overline={
        <CardMeta>
          <DatasetClassification dataset={parent} />
          <CardSourcesList
            sources={getTaxonomy(parent, TAXONOMY_SOURCE)?.values}
          />
        </CardMeta>
      }
      linkTo={getDatasetPath(parent)}
      linkLabel='View dataset'
      onLinkClick={(e) => {
        e.preventDefault();
        onDatasetClick();
      }}
      title={layer.name}
      description={`From: ${parent.name}`}
      imgSrc={parent.media?.src}
      imgAlt={parent.media?.alt}
      footerContent={
        <>
          {topics?.length ? (
            <CardTopicsList>
              <dt>Topics</dt>
              {topics.map((t) => (
                <dd key={t.id}>
                  <Pill variation='achromic'>{t.name}</Pill>
                </dd>
              ))}
            </CardTopicsList>
          ) : null}
          <DatasetMenu dataset={parent} />
        </>
      }
    />
  );
}
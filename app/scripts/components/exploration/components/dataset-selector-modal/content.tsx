import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { useAtom } from 'jotai';

import { DatasetData, DatasetLayer } from 'veda';
import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from '@devseed-ui/modal';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Button } from '@devseed-ui/button';
import { Subtitle } from '@devseed-ui/typography';
import {
  CollecticonPlus,
  CollecticonTickSmall,
  CollecticonXmarkSmall,
  iconDataURI
} from '@devseed-ui/collecticons';

import { timelineDatasetsAtom } from '../../atoms/datasets';
import {
  allDatasets,
  datasetLayers,
  findParentDataset,
  reconcileDatasets
} from '../../data-utils';

import RenderModalHeader from './header';

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
import {
  Actions,
  useBrowserControls
} from '$components/common/browse-controls/use-browse-controls';
import { prepareDatasets, sortOptions } from '$components/data-catalog';
import Pluralize from '$utils/pluralize';
import TextHighlight from '$components/common/text-highlight';

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

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    height: 3rem;
    min-width: 3rem;
    transform: translate(-50%, -50%);
    padding: ${glsp(0.5, 1, 0.5, 1)};
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${themeVal('color.primary')};
    border-radius: ${themeVal('shape.ellipsoid')};
    font-weight: ${themeVal('type.base.bold')};
    line-height: 1rem;
    background-image: url(${({ theme }) =>
      iconDataURI(CollecticonPlus, {
        color: theme.color?.surface,
        size: 'large'
      })});
    background-repeat: no-repeat;
    background-position: 0.75rem center;
    pointer-events: none;
    transition: all 0.16s ease-in-out;
    opacity: 0;
  }

  &:hover ::before {
    opacity: 1;
  }

  ${({ checked }) =>
    checked &&
    css`
      &:before {
        opacity: 1;
        content: 'Selected';
        padding-left: 2.75rem;
        background-image: url(${({ theme }) =>
          iconDataURI(CollecticonTickSmall, {
            color: theme.color?.surface,
            size: 'large'
          })});
        background-color: ${themeVal('color.base')};
      }
      &:hover ::before {
        background-color: ${themeVal('color.primary')};
      }
    `}
`;

function DatasetLayerCard(props: DatasetLayerProps) {
  const { parent, layer, onDatasetClick, selected, searchTerm } = props;

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
      title={
        <TextHighlight value={searchTerm} disabled={searchTerm.length < 3}>
          {layer.name}
        </TextHighlight>
      }
      description={
        <>
          From:{' '}
          <TextHighlight value={searchTerm} disabled={searchTerm.length < 3}>
            {parent.name}
          </TextHighlight>
        </>
      }
      imgSrc={layer.media?.src ?? parent.media?.src}
      imgAlt={layer.media?.alt ?? parent.media?.alt}
      footerContent={
        <>
          {topics?.length ? (
            <CardTopicsList>
              <dt>Topics</dt>
              {topics.map((t) => (
                <dd key={t.id}>
                  <Pill variation='achromic'>
                    <TextHighlight
                      value={searchTerm}
                      disabled={searchTerm.length < 3}
                    >
                      {t.name}
                    </TextHighlight>
                  </Pill>
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

export default function ModalContentRender(props) {
  const { search, selectedIds, displayDatasets, onCheck } = props;
  return(<>
  <DatasetContainer>
    {displayDatasets.length ? (
      <div>
      {displayDatasets.map(currentDataset => (
        <>
        <h4>{currentDataset.name}</h4>
        <span>{currentDataset.countSelectedLayers}</span>
        <p>{currentDataset.description}</p>
        <CardList key={currentDataset.id}>
        {currentDataset.layers.map((datasetLayer) => {
          return (
            <li key={datasetLayer.id}>
              <DatasetLayerCard
                searchTerm={search}
                layer={datasetLayer}
                parent={currentDataset}
                selected={selectedIds.includes(datasetLayer.id)}
                onDatasetClick={() => onCheck(datasetLayer.id)}
              />
            </li>
          );
        })}
        </CardList>
        </>
      ))}
      </div>
    ) : (
      <EmptyHub>
        There are no datasets to show with the selected filters.
      </EmptyHub>
    )}
  </DatasetContainer>
         </>);
}
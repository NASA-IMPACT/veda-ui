import React from 'react';
import styled, { css } from 'styled-components';
import {
  CollecticonPlus,
  CollecticonTickSmall,
  iconDataURI
} from '@devseed-ui/collecticons';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { Card, LinkProperties } from '../card';
import { CardMeta, CardTopicsList } from '../card/styles';
import { DatasetClassification } from '../dataset-classification';
import { CardSourcesList } from '../card-sources';
import TextHighlight from '../text-highlight';
import { getDatasetDescription, getMediaProperty } from './utils';
import { DatasetData, DatasetLayer } from '$types/veda';
import { getDatasetPath } from '$utils/routes';
import {
  TAXONOMY_SOURCE,
  TAXONOMY_TOPICS,
  getAllTaxonomyValues,
  getTaxonomy
} from '$utils/veda-data/taxonomies';
import { Pill } from '$styles/pill';

interface CatalogCardProps {
  dataset: DatasetData;
  layer?: DatasetLayer;
  searchTerm: string;
  selectable?: boolean;
  selected?: boolean;
  onDatasetClick?: () => void;
  pathname?: string;
  linkProperties: LinkProperties;
}

const CardSelectable = styled(Card)<{
  checked?: boolean;
  selectable?: boolean;
}>`
  outline: 4px solid transparent;
  ${({ checked }) =>
    checked &&
    css`
      outline-color: ${themeVal('color.primary')};
    `}

  ${({ selectable }) =>
    selectable &&
    css`
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 80px;
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
    `}

  ${({ checked }) =>
    checked &&
    css`
      &:before {
        opacity: 1;
        z-index: 10;
        content: 'Selected';
        color: ${themeVal('color.surface')};
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

export const CatalogCard = (props: CatalogCardProps) => {
  const {
    dataset,
    layer,
    searchTerm,
    selectable,
    selected,
    onDatasetClick,
    linkProperties,
    pathname
  } = props;

  const topics = getTaxonomy(dataset, TAXONOMY_TOPICS)?.values;
  const sources = getTaxonomy(dataset, TAXONOMY_SOURCE)?.values;
  const allTaxonomyValues = getAllTaxonomyValues(dataset).map((v) => v.name);

  const title = layer ? layer.name : dataset.name;
  const description = getDatasetDescription(layer, dataset);
  const imgSrc = getMediaProperty(layer, dataset, 'src');
  const imgAlt = getMediaProperty(layer, dataset, 'alt');

  const handleClick = (e: React.MouseEvent) => {
    if (onDatasetClick) {
      e.preventDefault();
      onDatasetClick();
    }
  };

  const linkTo = getDatasetPath(dataset, pathname);

  return (
    <CardSelectable
      cardType='horizontal-info'
      checked={selectable ? selected : undefined}
      selectable={selectable}
      tagLabels={allTaxonomyValues}
      overline={
        <CardMeta>
          <DatasetClassification dataset={dataset} />
          <CardSourcesList sources={sources} />
        </CardMeta>
      }
      linkLabel='View dataset'
      title={
        <TextHighlight value={searchTerm} disabled={searchTerm.length < 3}>
          {title}
        </TextHighlight>
      }
      description={
        <TextHighlight value={searchTerm} disabled={searchTerm.length < 3}>
          {description}
        </TextHighlight>
      }
      imgSrc={imgSrc}
      imgAlt={imgAlt}
      footerContent={
        <>
          {topics?.length ? (
            <CardTopicsList>
              <dt>Topics</dt>
              {topics.map((t) => (
                <dd key={t.id}>
                  <Pill variation='primary'>
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
        </>
      }
      linkProperties={{
        ...linkProperties,
        linkTo: linkTo,
        onLinkClick: handleClick
      }}
    />
  );
};

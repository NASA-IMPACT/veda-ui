import { glsp, themeVal } from "@devseed-ui/theme-provider";
import styled, { css } from "styled-components";
import { CollecticonPlus, CollecticonTickSmall, iconDataURI } from "@devseed-ui/collecticons";
import React from "react";
import { DatasetData, DatasetLayer } from "veda";
import { Card } from "../card";
import { CardMeta, CardTopicsList } from "../card/styles";
import { DatasetClassification } from "../dataset-classification";
import { CardSourcesList } from "../card-sources";
import TextHighlight from "../text-highlight";
import { getDatasetPath } from "$utils/routes";
import { TAXONOMY_SOURCE, TAXONOMY_TOPICS, getTaxonomy } from "$utils/veda-data";
import { Pill } from "$styles/pill";

interface CatalogCardSelectableProps {
    parent: DatasetData;
    layer: DatasetLayer;
    searchTerm: string;
    selected: boolean;
    onDatasetClick: () => void;
  }

const CardSelectable = styled(Card)<{ checked: boolean }>`
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

export function CatalogCardSelectable(props: CatalogCardSelectableProps) {
  const { parent, layer, onDatasetClick, selected, searchTerm } = props;

  const topics = getTaxonomy(parent, TAXONOMY_TOPICS)?.values;
  const sources = getTaxonomy(parent, TAXONOMY_SOURCE)?.values;

  return (
    <CardSelectable
      cardType='horizontal-info'
      checked={selected}
      overline={
        <CardMeta>
          <DatasetClassification dataset={parent} />
          <CardSourcesList
            sources={sources}
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
      description={<TextHighlight value={searchTerm} disabled={searchTerm.length < 3}>{layer.description}</TextHighlight>}
      imgSrc={layer.media?.src ?? parent.media?.src}
      imgAlt={layer.media?.alt ?? parent.media?.alt}
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
    />
  );
}
import React from 'react';
import { DatasetData } from "veda";
import { getAllTaxonomyValues } from "$utils/veda-data";
import { Card } from '$components/common/card';
import {  getDatasetPath } from '$utils/routes';
import TextHighlight from '$components/common/text-highlight';
import {
    minSearchLength,
  } from '$components/common/browse-controls/use-browse-controls';

interface CatalogCardProps {
  dataset: DatasetData;
  search: string;
}

export const CatalogCard = (props: CatalogCardProps) => {
  const { dataset, search } = props;
  const allTaxonomyValues = getAllTaxonomyValues(dataset).map((v) => v.name);
  
  return (
    <Card
      cardType='horizontal-info'
      tagLabels={allTaxonomyValues}
      linkTo={getDatasetPath(dataset)}
      title={
        <TextHighlight
          value={search}
          disabled={search.length < minSearchLength}
        >
          {dataset.name}
        </TextHighlight>
      }
      description={
        <TextHighlight
          value={search}
          disabled={search.length < minSearchLength}
        >
          {dataset.description}
        </TextHighlight>
      }
      imgSrc={dataset.media?.src}
      imgAlt={dataset.media?.alt}
    />
  );
};
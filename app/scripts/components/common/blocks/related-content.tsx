import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';

import {  
  thematics,
  discoveries,
  datasets, 
  Media, 
  ThematicData } from 'delta/thematics';
import { useThematicArea } from '$utils/thematics';
import { thematicRootPath, thematicDatasetsPath, thematicDiscoveriesPath } from '$utils/routes';
import { Card, CardList } from '$components/common/card';
import { FoldHeader, FoldTitle } from '$components/common/fold';
import { variableGlsp } from '$styles/variable-utils';

const contentCategory = {
  'thematics': thematics,
  'datasets': datasets,
  'discoveries': discoveries
};

const blockNum = 2;

const TwoColumnCardList = styled(CardList)`
  grid-template-columns: repeat(2, 1fr);
  margin-top: ${variableGlsp(1)};
`;

export type ParentType = 'thematic' | 'dataset' | 'discovery';
interface FormatBlock {
  id: string;
  name: string;
  link: string;
  thematic: ThematicData;
  media: Media;
  parent: ParentType;
}

function formatUrl(id: string, thematic: ThematicData, parent: string) {
  switch(parent) {
    case 'thematic':
      return  {
        parentLink: thematicRootPath(thematic),
        link: thematicRootPath(thematic)
      };
    case 'datasets':
      return  {
        parentLink: thematicDatasetsPath(thematic),
        link: `${thematicDatasetsPath(thematic)}/${id}`
      };
    case 'discoveries':
      return {
        parentLink: thematicDiscoveriesPath(thematic),
        link: `${thematicDiscoveriesPath(thematic)}/${id}`
      };
  }

}

function formatBlock({ id, name, thematic, media, parent }: FormatBlock) {
  return { id, name, ...formatUrl(id, thematic, parent), media, parent };
}

function findCurrentContent(arr: Array<any>, id: string) {
  return arr.find(e => e.id === id);
}

function formatContents(relatedData) {
  // relatedData.
  const rData = Object.keys(relatedData).map(contentType => {
    return relatedData[contentType].map(contentId => {
      const matchingContentId = Object.keys(contentCategory[contentType]).filter(e => e === contentId)[0];
      const matchingContent = contentCategory[contentType][matchingContentId].data;
      const thematicId = matchingContent.thematics.length? matchingContent.thematics[0]: matchingContent.thematics;
      return formatBlock({id:contentId, name: matchingContent.name, thematic: contentCategory.thematics[thematicId], media: matchingContent.media, contentType, parent: contentType});
    });
  }).flat();
  
  return rData;
}

function getMultipleRandom(arr: Array<any>, num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

export default function RelatedContent() {
  const thematic = useThematicArea();
  const { thematicId, datasetId, discoveryId } = useParams();

  const onThematicId =  (datasetId || discoveryId)? undefined: thematicId;
  const onDatasetId = (datasetId && !discoveryId)? datasetId : undefined;
  const onDiscoveryId = (!datasetId && discoveryId)? discoveryId: undefined;

  const currentContent = (onThematicId)? findCurrentContent(thematic.data, onThematicId) : (onDatasetId)? findCurrentContent(thematic.data.datasets, onDatasetId) : findCurrentContent(thematic.data.discoveries, onDiscoveryId);

  let relatedContents = formatContents(currentContent.related);
  if (relatedContents.length > blockNum) relatedContents = getMultipleRandom(relatedContents, blockNum);

  return (
    <>
      <FoldHeader>
        <FoldTitle> 
          Related Content 
        </FoldTitle>
      </FoldHeader>
      <TwoColumnCardList>
        {relatedContents.map((t) => (
          <li key={t.id}>
            <Card
              cardType='cover'
              linkLabel={`View ${t.parent} ${t.name}`}
              linkTo={t.link}
              title={t.name}
              parentName={t.parent}
              parentTo={t.parentLink}
              imgSrc={t.media.src}
              imgAlt={t.media.alt}
            />
          </li>
        ))}
      </TwoColumnCardList>
    </>
  );
}

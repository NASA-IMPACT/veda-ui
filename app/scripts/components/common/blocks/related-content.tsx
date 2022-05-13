import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';

import { Media, ThematicData } from 'delta/thematics';
import { useThematicArea } from '$utils/thematics';
import { thematicRootPath, thematicDatasetsPath, thematicDiscoveriesPath } from '$utils/routes';
import { Card, CardList } from '$components/common/card';
import { FoldHeader, FoldTitle } from '$components/common/fold';
import { variableGlsp } from '$styles/variable-utils';

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
    case 'dataset':
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

function findRelatedContent(arr: Array<any>, id?: string, thematic: ThematicData, parent: string) {
  return arr.filter(e => e.id !== id).map(e => formatBlock({...e, thematic, parent}));
}

function getMultipleRandom(arr: Array<any>, num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

export default function RelatedContent() {
  const thematic = useThematicArea();
  const { thematicId, datasetId, discoveryId } = useParams();
  const onThematicId =  (datasetId || discoveryId)? undefined: thematicId;

  // How should we pick the contents?
  const relatedContentsCandidates = [
    ...findRelatedContent([thematic.data], onThematicId, thematic,  'thematic'),
    ...findRelatedContent(thematic.data.datasets, datasetId, thematic,  'dataset'),
    ...findRelatedContent(thematic.data.discoveries, discoveryId, thematic, 'discovery')
  ];

  if (relatedContentsCandidates.length < blockNum) throw Error('Not enough related contents.');

  const relatedContents = getMultipleRandom(relatedContentsCandidates, blockNum);

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

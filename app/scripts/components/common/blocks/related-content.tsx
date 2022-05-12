import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';

import { useThematicArea } from '$utils/thematics';
import { thematicDatasetsPath, thematicDiscoveriesPath } from '$utils/routes';
import { Card, CardList } from '$components/common/card';
import { FoldHeader, FoldTitle } from '$components/common/fold';
import { variableGlsp } from '$styles/variable-utils';

const blockNum = 2;

const TwoColumnCardList = styled(CardList)`
  grid-template-columns: repeat(2, 1fr);
  margin-top: ${variableGlsp(1)};
`;

export type ParentType = 'thematic' | 'dataset' | 'discovery';
interface Media {
  src: string;
  alt: string;
  author?: {
    name: string;
    url: string
  }
}

interface FormatBlock {
  id: string;
  name: string;
  link: string;
  thematic: string;
  media: Media;
  parent: ParentType;
}

function formatUrl(id: string, thematic: string, parent: string) {
  switch(parent) {
    case 'thematic':
      return  {
        parentLink: `/${id}`,
        link: `${id}`
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

function findRelatedContent(arr: array, id: string, thematic: string, parent: string) {
  return arr.filter(e => e.id !== id).map(e => formatBlock({...e, thematic, parent}));
}

export default function RelatedContent() {
  const thematic = useThematicArea();
  const { thematicId, datasetId, discoveryId } = useParams();
  const onThematicId =  (datasetId || discoveryId)? undefined: thematicId;

  // How should we pick the contents?
  const relatedContents = [
    ...findRelatedContent([thematic.data], onThematicId, thematic,  'thematic'),
    ...findRelatedContent(thematic.data.datasets, datasetId, thematic,  'dataset'),
    ...findRelatedContent(thematic.data.discoveries, discoveryId, thematic, 'discovery')
  ].filter((e, idx) => idx < blockNum);

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

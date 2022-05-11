import React from 'react';
import styled from 'styled-components';

import { useThematicArea } from '$utils/thematics';
import { thematicDatasetsPath } from '$utils/routes';
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
      return `/${id}`;
    case 'dataset':
      return `/${thematic}/datasets/${id}`;
    case 'discoveries':
      return `/${thematic}/discoveries/${id}`;
  }

}

function formatBlock({ id, name, thematic, media, parent }: FormatBlock) {
  return { id, name, link: formatUrl(id, thematic, parent), media, parent };
}

export default function RelatedContent() {
  const thematic = useThematicArea();
  console.log(thematic.data);
  // How should we pick the contents?
  const relatedContents = [
    formatBlock({...thematic.data, thematic: thematic.data.id, parent: 'thematic'}),
    ...thematic.data.datasets.map((e) => formatBlock({...e, thematic: thematic.data.id, parent: 'dataset'})),
    ...thematic.data.discoveries.map((e) => formatBlock({...e, thematic: thematic.data.id, parent: 'discovery'}))
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
              parentTo={thematicDatasetsPath(thematic)}
              imgSrc={t.media.src}
              imgAlt={t.media.alt}
            />
          </li>
        ))}
      </TwoColumnCardList>
    </>
  );
}

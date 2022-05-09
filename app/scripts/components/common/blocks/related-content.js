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

function formatBlock({ id, name, description, media }, parent) {
  return { id, name, description, media, parent };
}

export default function RelatedContent() {
  const thematic = useThematicArea();

  // How should we pick the contents?
  const relatedContents = [
    formatBlock(thematic.data, 'thematic'),
    ...thematic.data.datasets.map((e) => formatBlock(e, 'dataset')),
    ...thematic.data.discoveries.map((e) => formatBlock(e, 'discovery'))
  ].filter((e, idx) => idx < blockNum);

  return (
    <>
      <FoldHeader>
        <FoldTitle> Related Content </FoldTitle>
      </FoldHeader>
      <TwoColumnCardList>
        {relatedContents.map((t) => (
          <li key={t.id}>
            <Card
              cardType='cover'
              linkLabel={`View ${t.parent} ${t.name}`}
              linkTo={t.id}
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

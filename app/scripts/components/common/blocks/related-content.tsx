import React from 'react';
import styled from 'styled-components';
import { useParams } from 'react-router';

import {  
  thematics,
  discoveries,
  datasets, 
  Media, 
  ThematicData,
  RelatedContentData } from 'delta/thematics';
import { thematicRootPath, thematicDatasetsPath, thematicDiscoveriesPath } from '$utils/routes';
import { Card, CardList } from '$components/common/card';
import { FoldHeader, FoldTitle } from '$components/common/fold';
import { variableGlsp } from '$styles/variable-utils';

const thematicsString = 'thematics';
const datasetsString = 'datasets';
const discoveriesString = 'discoveries';

const contentCategory = {
  [thematicsString]: thematics,
  [datasetsString]: datasets,
  [discoveriesString]: discoveries
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
    case thematicsString:
      return  {
        parentLink: thematicRootPath(thematic),
        link: thematicRootPath(thematic)
      };
    case datasetsString:
      return  {
        parentLink: thematicDatasetsPath(thematic),
        link: `${thematicDatasetsPath(thematic)}/${id}`
      };
    case discoveriesString:
      return {
        parentLink: thematicDiscoveriesPath(thematic),
        link: `${thematicDiscoveriesPath(thematic)}/${id}`
      };
    default:
      throw Error('Something went wrong with parent data of related content.');
  }

}

function formatBlock({ id, name, thematic, media, parent }: FormatBlock) {
  return { id, name, ...formatUrl(id, thematic, parent), media, parent };
}

function findCurrentContent({ parent, id }: { parent: string, id; string} ) {
  return contentCategory[parent][id].data;
}

function formatContents(relatedData: Array<RelatedContentData>) {
  const rData = Object.keys(relatedData).map(contentType => {
    return relatedData[contentType].map(contentId => {
      const matchingContentId = Object.keys(contentCategory[contentType]).filter(e => e === contentId)[0];
      const matchingContent = contentCategory[contentType][matchingContentId].data;
      const  thematicId = (!matchingContent.thematics)? matchingContent.id : matchingContent.thematics[0];
      return formatBlock({id:contentId, name: matchingContent.name, thematic: contentCategory.thematics[thematicId], media: matchingContent.media, contentType, parent: contentType});
    });
  }).flat();
  
  return rData;
}

function getMultipleRandom(arr: Array<FormatBlock>, num: number) {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function getCurrentCategory(thematicId: string | undefined, datasetId: string | undefined, discoveryId: string | undefined) {
  // if there is no dataset id nor discovery id -> thematics
  if (!datasetId && !discoveryId) {
    return {
      parent: thematicsString,
      id: thematicId
    };
  }
  // if there is dataset id but no discoveryid -> datasetId
  else if (datasetId && !discoveryId) {
    return {
      parent: datasetsString,
      id: datasetId
    };
  }
  // it should be discovery at this point
  else if (!datasetId && discoveryId) return {
    parent: discoveriesString,
    id: discoveryId
  };
  else return null;
}

export default function RelatedContent() {
  const { thematicId, datasetId, discoveryId } = useParams();

  // Check which category this page falls into
  const currentCategory = getCurrentCategory(thematicId, datasetId, discoveryId);
  
  if (!currentCategory) throw Error('Something went wrong. Make sure this is used in one of content type (thematics, dataset, discovery).');
  
  const currentContent = findCurrentContent(currentCategory);

  let relatedContents = formatContents(currentContent.related);
  
  if (relatedContents.length < blockNum) throw Error('Make sure there are at least two related contents.');
  // Just pick two if there are more than two related contents
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

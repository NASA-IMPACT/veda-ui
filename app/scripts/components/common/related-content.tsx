import React, { ReactNode } from 'react';
import styled from 'styled-components';

import {
  thematics,
  discoveries,
  datasets,
  Media,
  ThematicData,
  RelatedContentData,
  DiscoveryData,
  VedaDatum
} from 'veda/thematics';
import { utcString2userTzDate } from '$utils/date';
import {
  thematicRootPath,
  thematicDatasetsPath,
  thematicDiscoveriesPath
} from '$utils/routes';
import { Card, CardList } from '$components/common/card';
import { FoldHeader, FoldTitle } from '$components/common/fold';
import { variableGlsp } from '$styles/variable-utils';

import Block from '$components/common/blocks/';
import ContentBlockFigure from '$components/common/blocks/figure';

const thematicString = 'thematic';
const datasetString = 'dataset';
const discoveryString = 'discovery';

const contentCategory = {
  [thematicString]: thematics,
  [datasetString]: datasets,
  [discoveryString]: discoveries
};

const TwoColumnCardList = styled(CardList)`
  grid-template-columns: repeat(2, 1fr);
  margin-top: ${variableGlsp(1)};
`;

export type ParentType = 'thematic' | 'dataset' | 'discovery';

interface FormatBlock {
  id: string;
  name: string;
  description: string;
  date: string;
  link: string;
  parentLink: string;
  media: Media;
  parent: ParentType;
}

function formatUrl(
  id: string,
  thematic: VedaDatum<ThematicData>,
  parent: string
) {
  switch (parent) {
    case thematicString:
      return {
        parentLink: thematicRootPath(thematic),
        link: thematicRootPath(thematic)
      };
    case datasetString:
      return {
        parentLink: thematicDatasetsPath(thematic),
        link: `${thematicDatasetsPath(thematic)}/${id}`
      };
    case discoveryString:
      return {
        parentLink: thematicDiscoveriesPath(thematic),
        link: `${thematicDiscoveriesPath(thematic)}/${id}`
      };
    default:
      throw Error('Something went wrong with parent data of related content.');
  }
}

function formatBlock({
  id,
  name,
  description,
  date,
  thematic,
  media,
  parent
}): FormatBlock {
  return {
    id,
    name,
    description,
    date,
    ...formatUrl(id, thematic, parent),
    media,
    parent
  };
}

function formatContents(relatedData: RelatedContentData[]) {
  const rData = relatedData.map((relatedContent) => {
    const { type, id, thematic } = relatedContent;
    // if related content is thematic, it won't have thematic as an attribute
    const thematicId = !thematic ? id : thematic;

    // Even though type should be one of the defined values, this values comes
    // from user generated content and we can't be sure, so the checks are in
    // place.
    const matchingContent = contentCategory[type][id]?.data;

    if (!matchingContent) {
      throw Error(
        'Something went wrong. Check the related content frontmatter.'
      );
    }

    const { name, description, media } = matchingContent;
    return formatBlock({
      id,
      name,
      description,
      date: (matchingContent as DiscoveryData).pubDate,
      thematic: contentCategory[thematicString][thematicId],
      media,
      parent: type
    });
  });

  return rData;
}

interface RelatedContentProps {
  related: RelatedContentData[];
}

export default function RelatedContent(props: RelatedContentProps): ReactNode {
  const { related } = props;
  const relatedContents = formatContents(related);

  if (!relatedContents.length)
    throw Error('There is no related content defined.');

  return (
    <Block>
      <ContentBlockFigure>
        <FoldHeader>
          <FoldTitle>Related Content</FoldTitle>
        </FoldHeader>
        <TwoColumnCardList>
          {relatedContents.map((t) => (
            <li key={t.id}>
              <Card
                cardType='cover'
                linkLabel={`View ${t.parent} ${t.name}`}
                linkTo={t.link}
                title={t.name}
                date={
                  t.parent === discoveryString
                    ? utcString2userTzDate(t.date)
                    : null
                }
                description={t.description}
                parentName={t.parent}
                parentTo={t.parentLink}
                imgSrc={t.media.src}
                imgAlt={t.media.alt}
              />
            </li>
          ))}
        </TwoColumnCardList>
      </ContentBlockFigure>
    </Block>
  );
}

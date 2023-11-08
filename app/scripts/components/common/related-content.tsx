import React from 'react';
import styled from 'styled-components';
import { media } from '@devseed-ui/theme-provider';

import {
  stories,
  datasets,
  Media,
  RelatedContentData,
  LinkContentData,
  StoryData
} from 'veda';
import { utcString2userTzDate } from '$utils/date';
import {
  getDatasetPath,
  getStoryPath,
  STORIES_PATH,
  DATASETS_PATH
} from '$utils/routes';
import {
  Card,
  CardList
} from '$components/common/card';
import { FoldHeader, FoldTitle } from '$components/common/fold';
import { variableGlsp } from '$styles/variable-utils';
import { ContentBlock } from '$styles/content-block';

const datasetString = 'dataset';
const storyString = 'story';

const contentCategory = {
  [datasetString]: datasets,
  [storyString]: stories
};

const TwoColumnCardList = styled(CardList)`
  grid-template-columns: repeat(2, 1fr);
  margin-top: ${variableGlsp(1)};
`;

const RelatedContentInner = styled.div`
  grid-column: content-start / content-end;

  ${media.largeUp`
  grid-column:  content-3 / content-11;
`}
`;

interface FormatBlock {
  id: string;
  name: string;
  description: string;
  date: string;
  link: string;
  asLink?: LinkContentData;
  parentLink: string;
  media: Media;
  parent: RelatedContentData['type'];
}

function formatUrl(id: string, parent: string) {
  switch (parent) {
    case datasetString:
      return {
        parentLink: DATASETS_PATH,
        link: getDatasetPath(id)
      };
    case storyString:
      return {
        parentLink: STORIES_PATH,
        link: getStoryPath(id)
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
  media,
  asLink,
  type
}): FormatBlock {
  return {
    id,
    name,
    description,
    date,
    media,
    asLink,
    ...formatUrl(id, type),
    parent: type
  };
}

function formatContents(relatedData: RelatedContentData[]) {
  const rData = relatedData.map((relatedContent) => {
    const { type, id } = relatedContent;

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
      asLink: (matchingContent as StoryData).asLink,
      date: (matchingContent as StoryData).pubDate,
      media,
      type
    });
  });

  return rData;
}

interface RelatedContentProps {
  related: RelatedContentData[];
}

export default function RelatedContent(props: RelatedContentProps) {
  const { related } = props;
  const relatedContents = formatContents(related);

  if (!relatedContents.length)
    throw Error('There is no related content defined.');

  return (
    <ContentBlock>
      <RelatedContentInner>
        <FoldHeader>
          <FoldTitle>Related Content</FoldTitle>
        </FoldHeader>
        <TwoColumnCardList>
          {relatedContents.map((t) => {
            
            return (
              <li key={t.id}>
                <Card
                  cardType='cover'
                  linkLabel={`View ${t.parent} ${t.name}`}
                  linkTo={t.asLink?.url ?? t.link}
                  title={t.name}
                  date={
                    t.parent === storyString
                      ? utcString2userTzDate(t.date)
                      : undefined
                  }
                  description={t.description}
                  parentName={t.parent}
                  parentTo={t.parentLink}
                  imgSrc={t.media.src}
                  imgAlt={t.media.alt}
                />
              </li>
            );
          })}
        </TwoColumnCardList>
      </RelatedContentInner>
    </ContentBlock>
  );
}

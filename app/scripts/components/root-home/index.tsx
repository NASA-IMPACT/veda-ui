import React from 'react';
import styled from 'styled-components';

import vedaThematics from 'veda/thematics';

import { listReset, media, themeVal } from '@devseed-ui/theme-provider';

import { PageMainContent } from '$styles/page';
import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { Card, CardList } from '$components/common/card';
import {
  Fold,
  FoldHeader,
  FoldTitle,
  FoldLead,
  FoldBody
} from '$components/common/fold';
import Pluralize from '$utils/pluralize';
import { VarProse } from '$styles/variable-components';
import { variableGlsp } from '$styles/variable-utils';

const BlockValueProse = styled(VarProse)`
  /* styled-component */
`;

const BlockValueMedia = styled.figure`
  overflow: hidden;
  border-radius: ${themeVal('shape.rounded')};
`;

const BlockValue = styled.article`
  display: flex;
  flex-flow: row nowrap;
  gap: ${variableGlsp()};
  align-items: center;

  :nth-child(even) ${BlockValueMedia} {
    order: -1;
  }
`;

const BlockAudience = styled.article`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};
`;

const BlockAudienceProse = styled(VarProse)`
  /* styled-component */
`;

const BlockAudienceMedia = styled.figure`
  order: -1;
  overflow: hidden;
  border-radius: ${themeVal('shape.ellipsoid')};
`;

const AudienceList = styled.ul`
  ${listReset()};
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${variableGlsp()};

  ${media.mediumUp`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.largeUp`
    grid-template-columns: repeat(4, 1fr);
  `}
`;

const appTitle = process.env.APP_TITLE;

function RootHome() {
  return (
    <PageMainContent>
      <LayoutProps title='Welcome' />
      <PageHero
        title={`Welcome to ${appTitle}: NASA’s open-source Earth Science platform in the cloud.`}
      />
      <Fold>
        <FoldHeader>
          <FoldTitle>Explore the thematic areas</FoldTitle>
        </FoldHeader>
        <CardList>
          {vedaThematics.map((t) => (
            <li key={t.id}>
              <Card
                cardType='cover'
                linkLabel='View more'
                linkTo={t.id}
                title={t.name}
                parentName='Area'
                parentTo='/'
                description={t.description}
                overline={
                  <>
                    <i>Contains </i>
                    <Pluralize
                      zero='no discoveries'
                      singular='discovery'
                      plural='discoveries'
                      count={t.discoveries.length}
                    />
                    {' / '}
                    <Pluralize
                      zero='no datasets'
                      singular='dataset'
                      count={t.datasets.length}
                    />
                  </>
                }
                imgSrc={t.media?.src}
                imgAlt={t.media?.alt}
              />
            </li>
          ))}
        </CardList>
      </Fold>
      <Fold>
        <FoldHeader>
          <FoldTitle>Featured discoveries</FoldTitle>
        </FoldHeader>
        <FoldBody>
          <p>Content goes here.</p>
        </FoldBody>
      </Fold>
      <Fold>
        <FoldHeader>
          <FoldTitle>
            A scalable and interactive system for science data
          </FoldTitle>
          <FoldLead>
            VEDA stands for Visualization, Exploration, and Data Analysis.
          </FoldLead>
        </FoldHeader>
        <FoldBody>
          <BlockValue>
            <BlockValueProse>
              <h3>Comprehensive, open-source Earth Science data catalog</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                dignissim est id odio vehicula pharetra. Praesent id felis ac
                nulla vulputate dignissim.
              </p>
            </BlockValueProse>
            <BlockValueMedia>
              <img src='https://via.placeholder.com/960x512' alt='Fold image' />
            </BlockValueMedia>
          </BlockValue>

          <BlockValue>
            <BlockValueProse>
              <h3>Cloud-enabled scientific analysis</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                dignissim est id odio vehicula pharetra. Praesent id felis ac
                nulla vulputate dignissim.
              </p>
            </BlockValueProse>
            <BlockValueMedia>
              <img src='https://via.placeholder.com/960x512' alt='Fold image' />
            </BlockValueMedia>
          </BlockValue>

          <BlockValue>
            <BlockValueProse>
              <h3>Science communication platform</h3>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec
                dignissim est id odio vehicula pharetra. Praesent id felis ac
                nulla vulputate dignissim.
              </p>
            </BlockValueProse>
            <BlockValueMedia>
              <img src='https://via.placeholder.com/960x512' alt='Fold image' />
            </BlockValueMedia>
          </BlockValue>
        </FoldBody>
      </Fold>
      <Fold>
        <FoldHeader>
          <FoldTitle>VEDA serves a wide scientific audience</FoldTitle>
          <FoldLead>
            VEDA makes science based on NASA datasets inclusive, accessible, and
            reproducible.
          </FoldLead>
        </FoldHeader>
        <FoldBody>
          <AudienceList>
            <li>
              <BlockAudience>
                <BlockAudienceProse>
                  <h3>Earth scientists</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec dignissim est id odio vehicula pharetra. Praesent id
                    felis ac nulla vulputate dignissim.
                  </p>
                </BlockAudienceProse>
                <BlockAudienceMedia>
                  <img src='https://via.placeholder.com/640' alt='Fold image' />
                </BlockAudienceMedia>
              </BlockAudience>
            </li>

            <li>
              <BlockAudience>
                <BlockAudienceProse>
                  <h3>Advanced researchers</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec dignissim est id odio vehicula pharetra. Praesent id
                    felis ac nulla vulputate dignissim.
                  </p>
                </BlockAudienceProse>
                <BlockAudienceMedia>
                  <img src='https://via.placeholder.com/640' alt='Fold image' />
                </BlockAudienceMedia>
              </BlockAudience>
            </li>

            <li>
              <BlockAudience>
                <BlockAudienceProse>
                  <h3>Data producers</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec dignissim est id odio vehicula pharetra. Praesent id
                    felis ac nulla vulputate dignissim.
                  </p>
                </BlockAudienceProse>
                <BlockAudienceMedia>
                  <img src='https://via.placeholder.com/640' alt='Fold image' />
                </BlockAudienceMedia>
              </BlockAudience>
            </li>

            <li>
              <BlockAudience>
                <BlockAudienceProse>
                  <h3>General public</h3>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Donec dignissim est id odio vehicula pharetra. Praesent id
                    felis ac nulla vulputate dignissim.
                  </p>
                </BlockAudienceProse>
                <BlockAudienceMedia>
                  <img src='https://via.placeholder.com/640' alt='Fold image' />
                </BlockAudienceMedia>
              </BlockAudience>
            </li>
          </AudienceList>
        </FoldBody>
      </Fold>
    </PageMainContent>
  );
}

export default RootHome;

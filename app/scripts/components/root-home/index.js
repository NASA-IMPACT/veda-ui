import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

import deltaThematics from 'delta/thematics';
import { PageMainContent } from '../../styles/page';

import { LayoutProps } from '../common/layout-root';
import PageHero from '../common/page-hero';
import {
  Card,
  CardBody,
  CardHeader,
  CardList,
  CardOverline,
  CardSubtitle,
  CardTitle
} from '$styles/card';
import { Fold } from '$components/common/fold';
import { ElementInteractive } from '$components/common/element-interactive';
import { visuallyHidden } from '@devseed-ui/theme-provider';

const WelcomeFold = styled(Fold)`
  h2:first-of-type {
    ${visuallyHidden}
    background: red;
  }
`;

function RootHome() {
  return (
    <PageMainContent>
      <LayoutProps title='Welcome' />
      <PageHero title='Welcome' />
      <WelcomeFold>
        <h2>Explore the areas</h2>
        <CardList>
          {deltaThematics.map((t) => (
            <li key={t.id}>
              <ElementInteractive
                as={Card}
                linkLabel='View more'
                linkProps={{
                  as: Link,
                  to: t.id
                }}
              >
                <CardHeader>
                  <CardTitle>{t.name}</CardTitle>
                  <CardOverline>
                    {t.datasets.length} datasets, {t.discoveries.length}{' '}
                    discoveries
                  </CardOverline>
                </CardHeader>
                <CardBody>
                  <p>{t.description}</p>
                </CardBody>
              </ElementInteractive>
            </li>
          ))}
        </CardList>
      </WelcomeFold>
    </PageMainContent>
  );
}

export default RootHome;

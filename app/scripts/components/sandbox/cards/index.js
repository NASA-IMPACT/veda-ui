import React from 'react';
import { Link } from 'react-router-dom';

import { Fold } from '$components/common/fold';
import { ElementInteractive } from '$components/common/element-interactive';
import {
  Card,
  CardBody,
  CardFigure,
  CardHeader,
  CardLabel,
  CardList,
  CardOverline,
  CardTitle
} from '$styles/card';

function SandboxCards() {
  return (
    <Fold>
      <CardList>
        <li>
          <ElementInteractive
            as={Card}
            linkLabel='View more'
            linkProps={{
              as: Link,
              to: '/'
            }}
          >
            <CardHeader>
              <CardTitle>
                Cities Experiencing Clearer Air During Lockdowns
              </CardTitle>
              <CardOverline>
                <CardLabel>Discovery</CardLabel> published on{' '}
                <time dateTime='2021-10-26'>Oct 26, 2021</time>
              </CardOverline>
            </CardHeader>
            <CardBody>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                varius erat in interdum vulputate.
              </p>
            </CardBody>
            <CardFigure>
              <img
                src='https://picsum.photos/id/1002/2048/1024'
                alt='Generic placeholder by lorem picsum'
                loading='lazy'
              />
            </CardFigure>
          </ElementInteractive>
        </li>

        <li>
          <ElementInteractive
            as={Card}
            linkLabel='View more'
            linkProps={{
              as: Link,
              to: '/'
            }}
            cardType='cover'
          >
            <CardHeader>
              <CardTitle>Nitrogen Dioxide (NO₂)</CardTitle>
              <CardOverline>
                <CardLabel>Dataset</CardLabel>
              </CardOverline>
            </CardHeader>
            <CardBody>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fusce
                varius erat in interdum vulputate.
              </p>
            </CardBody>
            <CardFigure>
              <img
                src='https://picsum.photos/id/1002/2048/1024'
                alt='Generic placeholder by lorem picsum'
                loading='lazy'
              />
            </CardFigure>
          </ElementInteractive>
        </li>
      </CardList>
    </Fold>
  );
}

export default SandboxCards;

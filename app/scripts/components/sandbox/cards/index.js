import { Link } from 'react-router-dom';

import { Fold } from '$components/common/fold';
import {
  Card,
  CardBody,
  CardHeader,
  CardList,
  CardOverline,
  CardTitle
} from '$styles/card';
import React from 'react';

function SandboxCards() {
  return (
    <Fold>
      <CardList>
        <li>
          <Card>
            <CardHeader>
              <Link to=''>
                <CardTitle>Card title</CardTitle>
                <CardOverline>Card overline</CardOverline>
              </Link>
            </CardHeader>
            <CardBody>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris
                congue elit erat, vel lobortis velit porta vel.
              </p>
            </CardBody>
          </Card>
        </li>
      </CardList>
    </Fold>
  );
}

export default SandboxCards;

import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { Fold } from '$components/common/fold';
import { Card, CardHeader, CardList, CardTitle } from '$styles/card';
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
              </Link>
            </CardHeader>
          </Card>
        </li>
      </CardList>
    </Fold>
  );
}

export default SandboxCards;

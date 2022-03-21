import React from 'react';
import styled from 'styled-components';
import T from 'prop-types';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import {
  CollecticonArrowLoop,
  CollecticonCircleXmark
} from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';

import { variableGlsp } from '$styles/variable-utils';

const InlineAlert = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${glsp(0.5)};
  padding: ${variableGlsp(0.5, 1)};
  background: ${themeVal('color.danger-100')};
  color: ${themeVal('color.danger')};

  ${CollecticonCircleXmark} {
    flex-shrink: 0;
  }

  ${Button} {
    margin-left: auto;
  }
`;

export default function LayerAlert(props) {
  const { onRetryClick } = props;

  return (
    <InlineAlert>
      <CollecticonCircleXmark size='large' />
      <p>Failed loading</p>
      <Button
        fitting='skinny'
        size='small'
        variation='base-text'
        onClick={onRetryClick}
      >
        <CollecticonArrowLoop
          meaningful
          title='Retry layer loading'
        />
      </Button>
    </InlineAlert>
  );
}

LayerAlert.propTypes = {
  onRetryClick: T.func
};

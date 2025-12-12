import React from 'react';
import styled from 'styled-components';
import {
  ModalHeadline
} from '@devseed-ui/modal';
import { Heading } from '@devseed-ui/typography';


const StyledModalHeadline = styled(ModalHeadline)`
  width: 100%;
`;

export default function RenderModalHeader() {
  return(
    <StyledModalHeadline>
      <Heading size='small'>Data layers</Heading>
    </StyledModalHeadline>
  );
}
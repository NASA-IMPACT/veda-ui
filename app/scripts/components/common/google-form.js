import React, { useState } from 'react';
import styled from 'styled-components';

import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { glsp, media } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

const Wrapper = styled.div`
  grid-column: 1 / -1;
`;
const StyledGoogleForm = styled.iframe`
  width: 100%;
  margin-top: 20px;
`;

const ButtonAsNavLink = styled(Button)`
  appearance: none;
  position: relative;
  display: flex;
  gap: ${glsp(0.25)};
  align-items: center;
  border: 0;
  background: none;
  cursor: pointer;
  color: currentColor;
  font-weight: bold;
  text-decoration: none;
  text-align: left;
  padding: ${variableGlsp(0, 1)};
  transition: all 0.32s ease 0s;

  ${media.largeUp`
    padding: ${glsp(0.5, 0)};
  `}

  &:hover {
    opacity: 0.64;
  }

  > * {
    flex-shrink: 0;
  }

  /* Menu link line decoration */

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 0.125rem;
    height: 0;
    background: currentColor;

    ${media.largeUp`
      width: 0;
      height: 0.125rem;
    `}
  }

  &.active::after {
    ${media.mediumDown`
      height: 100%;
    `}

    ${media.largeUp`
      width: 100%;
    `}
  }
`;

function GoogleForm() {
  const [isRevealed, setRevealed] = useState(false);

  const close = () => setRevealed(false);
  const reveal = () => setRevealed(true);

  const renderForm = () => {
    return (
      <Fold>
        <Wrapper>
          <FoldHeader>
            <FoldTitle>Give us feedback</FoldTitle>
          </FoldHeader>
          <StyledGoogleForm
            src='https://docs.google.com/forms/d/e/1FAIpQLSfGcd3FDsM3kQIOVKjzdPn4f88hX8RZ4Qef7qBsTtDqxjTSkg/viewform?embedded=true'
            width='100%'
            height='504'
            frameBorder='0'
            marginHeight='0'
            marginWidth='0'
          >
            Loading…
          </StyledGoogleForm>
        </Wrapper>
      </Fold>
    );
  };

  return (
    <>
      <ButtonAsNavLink
        type='button'
        variation='base-text'
        fitting='skinny'
        onClick={reveal}
        style={{ color: 'white' }}
      >
        Feedback
      </ButtonAsNavLink>
      <Modal
        id='modal'
        revealed={isRevealed}
        onCloseClick={close}
        onOverlayClick={close}
        closeButton
        renderContents={renderForm}
      />
    </>
  );
}

export default GoogleForm;

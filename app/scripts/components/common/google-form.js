import React, { useState } from 'react';
import styled from 'styled-components';

import GlobalMenuLinkCSS from '$styles/menu-link';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { variableGlsp } from '$styles/variable-utils';

const Wrapper = styled.div`
  grid-column: 1 / -1;
`;
const StyledGoogleForm = styled.iframe`
  width: 100%;
  margin-top: ${variableGlsp(1)};
`;

// Global menu link style
const ButtonAsNavLink = styled(Button)`
  ${GlobalMenuLinkCSS}
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
            src={process.env.GOOGLE_FORM}
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
        size='large'
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

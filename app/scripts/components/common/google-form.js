import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import GlobalMenuLinkCSS from '$styles/menu-link';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';

const StyledGoogleForm = styled.iframe`
  width: 100%;
`;

// Global menu link style
const ButtonAsNavLink = styled(Button)`
  ${GlobalMenuLinkCSS}
`;

function GoogleForm() {
  const [isRevealed, setRevealed] = useState(false);

  const close = () => setRevealed(false);
  const reveal = () => setRevealed(true);

  useEffect(() => {
    const listener = () => setRevealed(true);
    document.addEventListener('show-feedback-modal', listener);
    return () => document.removeEventListener('show-feedback-modal', listener);
  }, []);

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
        title='Give us feedback'
        revealed={isRevealed}
        onCloseClick={close}
        onOverlayClick={close}
        closeButton
        content={
          <StyledGoogleForm
            src={process.env.GOOGLE_FORM}
            height='504'
            frameBorder='0'
            marginHeight='0'
            marginWidth='0'
          >
            Loading…
          </StyledGoogleForm>
        }
      />
    </>
  );
}

export default GoogleForm;

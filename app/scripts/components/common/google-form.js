import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import GlobalMenuLinkCSS from '$styles/menu-link';

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

  // The development page (app/scripts/components/root-development/index.tsx)
  // includes a button to trigger the feedback modal. That button dispatches an
  // event, which this modal reacts to.
  // Although this is not very React-y, it was quick to implement. The
  // alternative would be to track the modal status more globally (through an
  // app context for example) which would make it accessible everywhere.
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

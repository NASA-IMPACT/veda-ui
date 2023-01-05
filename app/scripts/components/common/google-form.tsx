import React from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';

import { useFeedbackModal } from './layout-root';

import GlobalMenuLinkCSS from '$styles/menu-link';

const StyledGoogleForm = styled.iframe`
  width: 100%;
`;

// Global menu link style
const ButtonAsNavLink = styled(Button)`
  ${GlobalMenuLinkCSS}
`;

function GoogleForm() {
  const { isRevealed, show, hide } = useFeedbackModal();

  return (
    <>
      <ButtonAsNavLink
        type='button'
        variation='base-text'
        fitting='skinny'
        onClick={show}
        style={{ color: 'white' }}
      >
        Feedback
      </ButtonAsNavLink>
      <Modal
        id='modal'
        size='large'
        title='Give us feedback'
        revealed={isRevealed}
        onCloseClick={hide}
        onOverlayClick={hide}
        closeButton
        content={
          <StyledGoogleForm
            src={process.env.GOOGLE_FORM}
            height={504}
            frameBorder={0}
            marginHeight={0}
            marginWidth={0}
          >
            Loading…
          </StyledGoogleForm>
        }
      />
    </>
  );
}

export default GoogleForm;

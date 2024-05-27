import React from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import { media, themeVal } from '@devseed-ui/theme-provider';

import { useFeedbackModal } from './layout-root/useFeedbackModal';

import GlobalMenuLinkCSS from '$styles/menu-link';

const StyledGoogleForm = styled.iframe`
  width: 100%;
`;

interface BtnMediaProps {
  active?: boolean;
}

// Global menu link style
const ButtonAsNavLink = styled(Button)`
  ${media.mediumUp<BtnMediaProps>`
    background-color: ${themeVal('color.primary-700')};

    &:hover {
      background-color: ${themeVal('color.primary-800')};
    }

    /* Print & when prop is passed */
    ${({ active }) => active && '&,'}
    &:active,
    &.active {
      background-color: ${themeVal('color.primary-900')};
    }

    &:focus-visible {
      background-color: ${themeVal('color.primary-200a')};
    }
  `}

  ${media.mediumDown`
    ${GlobalMenuLinkCSS}
  `}
`;

function GoogleForm() {
  const { isRevealed, show, hide } = useFeedbackModal();

  return (
    <>
      <ButtonAsNavLink
        type='button'
        size='large'
        onClick={show}
        style={{ color: 'white' }}
      >
        Contact Us
      </ButtonAsNavLink>
      <Modal
        id='modal'
        size='large'
        title='Contact Us'
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

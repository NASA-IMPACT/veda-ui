import React from 'react';
import styled from 'styled-components';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import { media, themeVal } from '@devseed-ui/theme-provider';
import {
  USWDSButton,
} from '$components/common/uswds';

import { useFeedbackModal } from './layout-root';

import GlobalMenuLinkCSS from '$styles/menu-link';

const StyledGoogleForm = styled.iframe`
  width: 100%;
`;

interface BtnMediaProps {
  active?: boolean;
}

const GoogleForm: React.FC<{ title: string, src: string }> = (props) => {
  const { title, src } = props;
  const { isRevealed, show, hide } = useFeedbackModal();

  return (
    <>
      <USWDSButton
        onClick={show}
        outline={true}
        type='button'
        size='small'
      >
        {title}
      </USWDSButton>
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
            src={src}
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
};

export default GoogleForm;

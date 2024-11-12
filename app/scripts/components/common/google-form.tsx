import React from 'react';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';
import {
  USWDSButton,
} from '$components/common/uswds';

import { useFeedbackModal } from './layout-root';

const StyledGoogleForm = styled.iframe`
  width: 100%;
`;

const GoogleForm: React.FC<{ title: string, src: string }> = (props) => {
  const { title, src } = props;
  const { isRevealed, show, hide } = useFeedbackModal();

  return (
    <>
      <USWDSButton
        onClick={show}
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

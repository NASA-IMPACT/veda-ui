import React from 'react';
import styled from 'styled-components';
import { Modal } from '@devseed-ui/modal';

const StyledGoogleForm = styled.iframe`
  width: 100%;
`;

const GoogleForm = (props: {
  src: string;
  isRevealed: boolean;
  hide: () => void;
}) => {
  const { src, isRevealed, hide } = props;

  return (
    <>
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

import React, { useState } from 'react';
import styled from 'styled-components';

import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';

const Wrapper = styled.div`
  grid-column: 1 / -1;
`;
const StyledGoogleForm = styled.iframe`
  width: 100%;
  margin-top: 20px;
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
      <Button
        type='button'
        variation='base-text'
        fitting='skinny'
        onClick={reveal}
        style={{ color: 'white' }}
      >
        Feedback
      </Button>
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

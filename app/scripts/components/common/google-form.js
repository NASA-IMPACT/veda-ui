import React, { useState } from 'react';
import styled from 'styled-components';

import GlobalMenuLinkCSS from '$styles/MenuLink';
import { Button } from '@devseed-ui/button';
import { Modal } from '@devseed-ui/modal';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';
import { glsp, media } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';

const formUrl =
  'https://docs.google.com/forms/d/e/1FAIpQLSfGcd3FDsM3kQIOVKjzdPn4f88hX8RZ4Qef7qBsTtDqxjTSkg/viewform?embedded=true';

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
            src={formUrl}
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

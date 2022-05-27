import React from 'react';
import styled from 'styled-components';

import Constrainer from '$styles/constrainer';
import { Fold, FoldHeader, FoldTitle } from '$components/common/fold';

const Wrapper = styled.div`
  grid-column: 1 / -1;
`;
const StyledGoogleForm = styled.iframe`
  width: 100%;
  margin-top: 20px;
`;
function GoogleForm() {
  return (
    <Fold>
      <Wrapper>
        <FoldHeader>
          <FoldTitle>Give us feedback</FoldTitle>
        </FoldHeader>
        <StyledGoogleForm
          src='https://docs.google.com/forms/d/e/1FAIpQLSfGcd3FDsM3kQIOVKjzdPn4f88hX8RZ4Qef7qBsTtDqxjTSkg/viewform?embedded=true'
          width='100%'
          height='1304'
          frameBorder='0'
          marginHeight='0'
          marginWidth='0'
        >
          Loading…
        </StyledGoogleForm>
      </Wrapper>
    </Fold>
  );
}
export default GoogleForm;

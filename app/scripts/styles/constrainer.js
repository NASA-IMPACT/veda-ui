import styled from 'styled-components';
import { themeVal, glsp, media } from '@devseed-ui/theme-provider';

const Constrainer = styled.div`
  padding-left: ${glsp(themeVal('layout.glspMultiplier.xsmall'))};
  padding-right: ${glsp(themeVal('layout.glspMultiplier.xsmall'))};
  margin: 0 auto;
  width: 100%;
  max-width: ${themeVal('layout.max')};

  ${media.smallUp`
    padding-left: ${glsp(themeVal('layout.glspMultiplier.small'))};
    padding-right: ${glsp(themeVal('layout.glspMultiplier.small'))};
  `}

  ${media.mediumUp`
    padding-left: ${glsp(themeVal('layout.glspMultiplier.medium'))};
    padding-right: ${glsp(themeVal('layout.glspMultiplier.medium'))};
  `}

  ${media.largeUp`
    padding-left: ${glsp(themeVal('layout.glspMultiplier.large'))};
    padding-right: ${glsp(themeVal('layout.glspMultiplier.large'))};
  `}

  ${media.xlargeUp`
    padding-left: ${glsp(themeVal('layout.glspMultiplier.xlarge'))};
    padding-right: ${glsp(themeVal('layout.glspMultiplier.xlarge'))};
  `}
`;

export default Constrainer;

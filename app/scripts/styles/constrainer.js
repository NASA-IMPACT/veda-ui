import styled from 'styled-components';
import { themeVal, glsp, media } from '@devseed-ui/theme-provider';

const Constrainer = styled.div`
  padding-left: ${glsp(themeVal('layout.gap.xsmall'))};
  padding-right: ${glsp(themeVal('layout.gap.xsmall'))};
  margin: 0 auto;
  width: 100%;
  max-width: ${themeVal('layout.max')};

  ${media.smallUp`
    padding-left: ${glsp(themeVal('layout.gap.small'))};
    padding-right: ${glsp(themeVal('layout.gap.small'))};
  `}

  ${media.mediumUp`
    padding-left: ${glsp(themeVal('layout.gap.medium'))};
    padding-right: ${glsp(themeVal('layout.gap.medium'))};
  `}

  ${media.largeUp`
    padding-left: ${glsp(themeVal('layout.gap.large'))};
    padding-right: ${glsp(themeVal('layout.gap.large'))};
  `}

  ${media.xlargeUp`
    padding-left: ${glsp(themeVal('layout.gap.xlarge'))};
    padding-right: ${glsp(themeVal('layout.gap.xlarge'))};
  `}
`;

export default Constrainer;

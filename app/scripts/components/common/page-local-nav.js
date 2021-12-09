import React from 'react';
import T from 'prop-types';
import styled, { css } from 'styled-components';

import { Link } from 'react-router-dom';

import { glsp, themeVal, media, divide } from '@devseed-ui/theme-provider';
import { reveal } from '@devseed-ui/animation';
import { createHeadingStyles } from '@devseed-ui/typography';

const innerSpacingCss = (size) => css`
  gap: ${glsp(themeVal(`layout.gap.${size}`))};
  padding: ${glsp(
    divide(themeVal(`layout.gap.${size}`), 2),
    themeVal(`layout.gap.${size}`)
  )};
`;

const PageLocalNavSelf = styled.nav`
  ${innerSpacingCss('xsmall')}
  position: sticky;
  top: 0;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${glsp()};
  background: ${themeVal('color.primary')};
  color: ${themeVal('color.surface')};
  animation: ${reveal} 0.32s ease 0s 1;

  ${media.smallUp`
    ${innerSpacingCss('xsmall')}
  `}

  ${media.mediumUp`
    ${innerSpacingCss('medium')}
  `}

  ${media.largeUp`
    ${innerSpacingCss('large')}
  `}

  ${media.xlargeUp`
    ${innerSpacingCss('xlarge')}
  `}
`;

const LocalTitle = styled.div`
  ${createHeadingStyles({ size: 'small' })}

  a,
  a:visited {
    color: ${themeVal('color.surface')};
    text-decoration: none;
  }
`;

const LocalMenu = styled.ul`
  margin: 0 0 0 auto;
  list-style: none;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${glsp()};

  a,
  a:visited {
    color: inherit;
    text-decoration: none;
  }
`;

function PageLocalNav(props) {
  return (
    <PageLocalNavSelf>
      <LocalTitle>
        <Link to='/'>{props.title}</Link>
      </LocalTitle>
      <LocalMenu>
        <li>
          <Link to='/'>Overview</Link>
        </li>
        <li>
          <Link to='/'>Exploration</Link>
        </li>
        <li>
          <Link to='/'>Usage</Link>
        </li>
      </LocalMenu>
    </PageLocalNavSelf>
  );
}

export default PageLocalNav;

PageLocalNav.propTypes = {
  title: T.string
};

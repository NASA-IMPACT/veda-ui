import styled from 'styled-components';
import {
  glsp,
  listReset,
  media,
  multiply,
  themeVal,
  visuallyHidden
} from '@devseed-ui/theme-provider';
import { Overline } from '@devseed-ui/typography';
import { VerticalDivider } from '@devseed-ui/toolbar';
import { variableGlsp } from '$styles/variable-utils';
import { Figure } from '$components/common/figure';
import { VarHeading } from '$styles/variable-components';

export const CardBlank = styled.article`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  border-radius: ${multiply(themeVal('shape.rounded'), 2)};
  box-shadow: ${themeVal('boxShadow.elevationD')};
  height: 100%;
  overflow: hidden;
  transition: all 0.24s ease-in-out 0s;
`;

export const CardList = styled.ol`
  ${listReset()}
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const CardListGrid = styled.ol`
  ${listReset()}
  grid-column: 1 / -1;
  display: grid;
  gap: ${variableGlsp()};
  grid-template-columns: repeat(1, 1fr);

  ${media.mediumUp`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.largeUp`
    grid-template-columns: repeat(3, 1fr);
  `}

  > li {
    min-width: 0;
  }
`;

export const CardHeader = styled.header`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  align-items: flex-end;
  padding: ${variableGlsp()};
  gap: ${variableGlsp()};
`;

export const CardHeadline = styled.div`
  display: flex;
  flex-flow: column nowrap;
  gap: ${glsp(0.25)};
`;

export const CardActions = styled.div`
  /* styled-component */
`;

export const CardTitle = styled(VarHeading).attrs({
  as: 'h3',
  size: 'small'
})`
  /* styled-component */
`;

export const CardOverline = styled(Overline)`
  order: -1;
  color: ${themeVal('color.base-400a')};

  > * {
    line-height: inherit;
  }

  i {
    ${visuallyHidden()}
  }
`;

export const CardMeta = styled.div`
  display: flex;
  gap: ${glsp(0.25)};

  a {
    color: inherit;
    pointer-events: all;

    &,
    &:visited {
      text-decoration: none;
      color: inherit;
    }

    &:hover {
      opacity: 0.64;
    }
  }

  > ${/* sc-selector */ VerticalDivider}:last-child {
    display: none;
  }

  > ${/* sc-selector */ VerticalDivider}:first-child {
    display: none;
  }
`;

export const CardBody = styled.div`
  padding: ${variableGlsp()};

  &:not(:first-child) {
    padding-top: 0;
    margin-top: ${variableGlsp(-0.5)};
  }
`;

export const CardFooter = styled.div`
  display: flex;
  flex-flow: row nowrap;
  gap: ${variableGlsp(0.5)};
  padding: ${variableGlsp()};

  &:not(:first-child) {
    padding-top: 0;
    margin-top: ${variableGlsp(-0.5)};
  }

  button {
    pointer-events: all;
  }
`;

export const CardTopicsList = styled.dl`
  display: flex;
  gap: ${variableGlsp(0.25)};
  max-width: 100%;
  width: 100%;
  overflow: hidden;
  mask-image: linear-gradient(
    to right,
    black calc(100% - 3rem),
    transparent 100%
  );

  > dt {
    ${visuallyHidden()}
  }
`;

export const CardLabel = styled.span`
  position: absolute;
  z-index: 1;
  top: ${variableGlsp()};
  right: ${variableGlsp()};
  display: inline-block;
  vertical-align: top;
  color: ${themeVal('color.surface')};
  border-radius: ${themeVal('shape.ellipsoid')};
  padding: ${glsp(0.125, 0.5)};
  background: ${themeVal('color.base-400a')};
  pointer-events: auto;
  transition: all 0.24s ease 0s;

  &,
  &:visited {
    text-decoration: none;
  }

  &:hover {
    opacity: 0.64;
  }
`;

export const CardFigure = styled(Figure)`
  order: -1;
  width: 100%;
  ${(props) => !props.isCoverOrFeatured && `aspect-ratio: 2/1;`}
  background: ${(props) =>
    props.src ? 'none' : props.theme.color['primary-100']};

  img {
    height: 100%;
    width: 100%;
    object-fit: cover;
    mix-blend-mode: multiply;
    display: ${(props) => (props.src ? 'block' : 'none')};
  }
`;

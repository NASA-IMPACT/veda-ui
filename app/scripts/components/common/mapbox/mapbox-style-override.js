import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';
import {
  createButtonGroupStyles,
  createButtonStyles
} from '@devseed-ui/button';

import {
  iconDataURI,
  CollecticonPlusSmall,
  CollecticonMinusSmall
} from '@devseed-ui/collecticons';
import { css } from 'styled-components';

const MapboxStyleOverride = css`
  .mapboxgl-control-container {
    position: absolute;
    inset: ${variableGlsp()};
    pointer-events: none;

    > * {
      display: flex;
      flex-flow: column nowrap;
      gap: ${glsp(0.5)};
      align-items: flex-start;
      float: none;
      pointer-events: auto;
    }

    .mapboxgl-ctrl {
      margin: 0;
    }

    .mapboxgl-ctrl-attrib {
      order: 100;
      padding: 0;
      background: none;
    }

    .mapboxgl-ctrl-attrib-inner {
      color: ${themeVal('color.surface')};
      border-radius: ${themeVal('shape.ellipsoid')};
      padding: ${glsp(0.125, 0.5)};
      font-size: 0.75rem;
      line-height: 1rem;
      background: ${themeVal('color.base-400a')};
      transform: translateY(-0.075rem);

      a,
      a:visited {
        color: inherit;
        font-size: inherit;
        line-height: inherit;
        vertical-align: top;
        text-decoration: none;
      }

      a:hover {
        opacity: 0.64;
      }
    }
  }

  .mapboxgl-ctrl-logo,
  .mapboxgl-ctrl-attrib-inner {
    margin: 0;
    opacity: 0.48;
    transition: all 0.24s ease-in-out 0s;

    &:hover {
      opacity: 1;
    }
  }

  .mapboxgl-ctrl-bottom-left {
    flex-direction: row;
    align-items: flex-end;
  }

  .mapboxgl-ctrl-group {
    ${createButtonGroupStyles({ orientation: 'vertical' })}
    background: none;

    &,
    &:not(:empty) {
      box-shadow: ${themeVal('boxShadow.elevationA')};
    }

    > button {
      span {
        display: none;
      }

      &::before {
        display: inline-block;
        content: '';
        background-repeat: no-repeat;
        background-size: 1rem 1rem;
        width: 1rem;
        height: 1rem;
      }
    }

    > button:first-child:not(:last-child) {
      &,
      &::after {
        border-bottom-right-radius: 0;
        border-bottom-left-radius: 0;
      }

      &::after {
        clip-path: inset(-100% -100% 0 -100%);
      }
    }
    > button:last-child:not(:first-child) {
      &,
      &::after {
        border-top-left-radius: 0;
        border-top-right-radius: 0;
      }

      &::after {
        clip-path: inset(0 -100% -100% -100%);
      }
    }
    > button:not(:first-child):not(:last-child) {
      &,
      &::after {
        border-radius: 0;
      }

      &::after {
        clip-path: inset(0 -100%);
      }
    }
    > button + button {
      margin-top: -${themeVal('button.shape.border')};
    }
  }

  .mapboxgl-ctrl-zoom-in.mapboxgl-ctrl-zoom-in,
  .mapboxgl-ctrl-zoom-out.mapboxgl-ctrl-zoom-out {
    ${createButtonStyles({ variation: 'primary-fill', fitting: 'skinny' })}
  }

  .mapboxgl-ctrl-zoom-in.mapboxgl-ctrl-zoom-in::before {
    background-image: url('${({ theme }) =>
      iconDataURI(CollecticonPlusSmall, {
        color: theme.color.surface
      })}');
  }

  .mapboxgl-ctrl-zoom-out.mapboxgl-ctrl-zoom-out::before {
    background-image: url('${({ theme }) =>
      iconDataURI(CollecticonMinusSmall, {
        color: theme.color.surface
      })}');
  }

  .mapboxgl-marker:hover {
    cursor: pointer;
  }
`;

export default MapboxStyleOverride;

import { css } from 'styled-components';
import {
  createButtonGroupStyles,
  createButtonStyles
} from '@devseed-ui/button';
import {
  iconDataURI,
  CollecticonPlusSmall,
  CollecticonMinusSmall,
  CollecticonMagnifierLeft,
  CollecticonXmarkSmall
} from '@devseed-ui/collecticons';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { variableGlsp } from '$styles/variable-utils';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

const MapboxStyleOverride = css`
  .mapboxgl-ctrl-logo,
  .mapboxgl-ctrl-attrib-inner {
    margin: 0;
    opacity: 0.48;
    transition: all 0.24s ease-in-out 0s;

    &:hover {
      opacity: 1;
    }
  }

  .mapboxgl-control-container {
    position: absolute;
    inset: ${variableGlsp()};
    pointer-events: none;

    > * {
      display: flex;
      flex-flow: column nowrap;
      gap: ${variableGlsp(0.5)};
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

    > button + button {
      margin-top: -${themeVal('button.shape.border')};
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
  }

  .mapboxgl-ctrl-zoom-in.mapboxgl-ctrl-zoom-in,
  .mapboxgl-ctrl-zoom-out.mapboxgl-ctrl-zoom-out {
    ${createButtonStyles({ variation: 'primary-fill', fitting: 'skinny' })}
  }

  .mapboxgl-ctrl-zoom-in.mapboxgl-ctrl-zoom-in::before {
    background-image: url(${({ theme }) =>
      iconDataURI(CollecticonPlusSmall, {
        color: theme.color.surface
      })});
  }

  .mapboxgl-ctrl-zoom-out.mapboxgl-ctrl-zoom-out::before {
    background-image: url(${({ theme }) =>
      iconDataURI(CollecticonMinusSmall, {
        color: theme.color.surface
      })});
  }

  .mapboxgl-marker:hover {
    cursor: pointer;
  }

  /* GEOCODER styles */
  .mapboxgl-ctrl.mapboxgl-ctrl-geocoder {
    background-color: ${themeVal('color.surface')};
    color: ${themeVal('type.base.color')};
    font: ${themeVal('type.base.style')} ${themeVal('type.base.weight')}
      0.875rem/1.25rem ${themeVal('type.base.family')};
    transition: all 0.24s ease 0s;

    &::before {
      position: absolute;
      top: 8px;
      left: 8px;
      content: '';
      width: 1rem;
      height: 1rem;
      background-image: url(${({ theme }) =>
        iconDataURI(CollecticonMagnifierLeft, {
          color: theme.color.primary
        })});
      background-repeat: no-repeat;
    }

    &.mapboxgl-ctrl-geocoder--collapsed {
      width: 2rem;
      min-width: 2rem;
      background-color: ${themeVal('color.primary')};

      &::before {
        background-image: url(${({ theme }) =>
          iconDataURI(CollecticonMagnifierLeft, {
            color: theme.color.surface
          })});
      }
    }

    .mapboxgl-ctrl-geocoder--icon {
      display: none;
    }

    .mapboxgl-ctrl-geocoder--icon-loading {
      top: 5px;
      right: 8px;
    }

    .mapboxgl-ctrl-geocoder--button {
      width: 2rem;
      height: 2rem;
      top: 0;
      right: 0;
      background: none;
      border-radius: ${themeVal('shape.rounded')};
      transition: all 0.24s ease 0s;
      color: inherit;

      &:hover {
        opacity: 0.64;
      }

      &::before {
        position: absolute;
        top: 8px;
        left: 8px;
        content: '';
        width: 1rem;
        height: 1rem;
        background-image: url(${({ theme }) =>
          iconDataURI(CollecticonXmarkSmall, {
            color: theme.color['base-300']
          })});
      }
    }

    .mapboxgl-ctrl-geocoder--input {
      height: 2rem;
      width: 100%;
      outline: none;
      font: ${themeVal('type.base.style')} ${themeVal('type.base.weight')}
        0.875rem / ${themeVal('type.base.line')} ${themeVal('type.base.family')};
      padding: 0.25rem 2rem;
      color: inherit;

      &::placeholder {
        color: inherit;
        opacity: 0.64;
      }
    }

    .mapboxgl-ctrl-geocoder--powered-by {
      display: none !important;
    }

    .suggestions {
      margin-bottom: 0.5rem;
      border-radius: ${themeVal('shape.rounded')};
      font: inherit;

      a {
        padding: 0.375rem 1rem;
        color: inherit;
        transition: all 0.24s ease 0s;

        &:hover {
          opacity: 1;
          color: ${themeVal('color.primary')};
          background: ${themeVal('color.primary-100')};
        }
      }

      li {
        &:first-child a {
          padding-top: 0.5rem;
        }

        &:last-child a {
          padding-bottom: 0.75rem;
        }

        &.active > a {
          position: relative;
          background: ${themeVal('color.primary-50')};
          color: ${themeVal('color.primary')};

          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 0.25rem;
            background: ${themeVal('color.primary')};
          }

          &:hover {
            background: ${themeVal('color.primary-100')};
          }
        }
      }
    }
  }
`;

export default MapboxStyleOverride;

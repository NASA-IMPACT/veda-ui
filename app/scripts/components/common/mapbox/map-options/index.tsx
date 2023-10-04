import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { CollecticonGlobe } from '@devseed-ui/collecticons';
import {
  Dropdown,
  DropMenu,
  DropMenuItem,
  DropTitle
} from '@devseed-ui/dropdown';
import { Button, createButtonStyles } from '@devseed-ui/button';
import { FormSwitch } from '@devseed-ui/form';
import { Subtitle } from '@devseed-ui/typography';

import {
  ProjectionItemConic,
  ProjectionItemCustom,
  ProjectionItemSimple
} from './projection-items';
import { MapOptionsProps } from './types';
import { projectionsList } from './utils';
import { BASEMAP_STYLES } from './basemaps';

const DropHeader = styled.div`
  padding: ${glsp()};
  box-shadow: inset 0 -1px 0 0 ${themeVal('color.base-100a')};
`;

const DropBody = styled.div`
  padding: ${glsp(0, 0, 1, 0)};
`;

/**
 * Override Dropdown styles to be wider and play well with the shadow scrollbar.
 */
const MapOptionsDropdown = styled(Dropdown)`
  padding: 0;
  max-width: 16rem;

  ${DropTitle} {
    margin: 0;
  }

  ${DropMenu} {
    margin: 0;
    padding-top: 0;
    padding-bottom: 0;
  }
`;

// Why you ask? Very well:
// Mapbox's css has an instruction that sets the hover color for buttons to
// near black. The only way to override it is to increase the specificity and
// we need the button functions to get the correct color.
// The infamous instruction:
// .mapboxgl-ctrl button:not(:disabled):hover {
//   background-color: rgba(0, 0, 0, 0.05);
// }
const SelectorButton = styled(Button)`
  &&& {
    ${createButtonStyles({ variation: 'primary-fill', fitting: 'skinny' })}
  }
`;

const ContentGroup = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const ContentGroupHeader = styled.div`
  padding: ${glsp(1, 1, 0.5, 1)};
`;

const ContentGroupTitle = styled(Subtitle)`
  /* styled-component */
`;

const ContentGroupBody = styled.div`
  /* styled-component */
`;

const OptionSwitch = styled(FormSwitch)`
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  width: 100%;
  font-size: inherit;
`;

const OptionMedia = styled.figure`
  position: relative;
  height: 2rem;
  overflow: hidden;
  border-radius: ${themeVal('shape.rounded')};
  flex-shrink: 0;
  aspect-ratio: 1.5 / 1;
  background: ${themeVal('color.base-50')};
  margin-left: auto;

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 2;
    content: '';
    box-shadow: inset 0 0 0 1px ${themeVal('color.base-100a')};
    border-radius: ${themeVal('shape.rounded')};
    pointer-events: none;
  }
`;

function MapOptions(props: MapOptionsProps) {
  const {
    projection,
    onProjectionChange,
    basemapStyleId,
    onBasemapStyleIdChange,
    labelsOption,
    boundariesOption,
    onOptionChange
  } = props;

  return (
    <MapOptionsDropdown
      triggerElement={(bag) => (
        <SelectorButton {...bag}>
          <CollecticonGlobe meaningful title='Configure map options' />
        </SelectorButton>
      )}
      direction='down'
      alignment='left'
    >
      <DropHeader>
        <DropTitle>Map options</DropTitle>
      </DropHeader>
      <DropBody>
        
          <ContentGroup>
            <ContentGroupHeader>
              <ContentGroupTitle>Style</ContentGroupTitle>
            </ContentGroupHeader>
            <ContentGroupBody>
              <DropMenu as='ol'>
                {BASEMAP_STYLES.map((basemap) => (
                  <li key={basemap.id}>
                    <DropMenuItem
                      href='#'
                      active={basemapStyleId === basemap.id}
                      onClick={(e) => {
                        e.preventDefault();
                        onBasemapStyleIdChange?.(basemap.id);
                      }}
                    >
                      <span>{basemap.label}</span>
                      <OptionMedia>
                        <img
                          src={basemap.thumbnailUrl}
                          alt='Map style thumbnail'
                        />
                      </OptionMedia>
                    </DropMenuItem>
                  </li>
                ))}
              </DropMenu>
            </ContentGroupBody>
          </ContentGroup>

          <ContentGroup>
            <ContentGroupHeader>
              <ContentGroupTitle>Details</ContentGroupTitle>
            </ContentGroupHeader>
            <ContentGroupBody>
              <DropMenu>
                <li>
                  <DropMenuItem as='span'>
                    <OptionSwitch
                      name='labels'
                      id='labels'
                      value='labels'
                      checked={labelsOption}
                      onChange={(e) => {
                        onOptionChange?.('labels', e.target.checked);
                      }}
                    >
                      Labels
                    </OptionSwitch>
                  </DropMenuItem>
                </li>
                <li>
                  <DropMenuItem as='span'>
                    <OptionSwitch
                      name='boundaries'
                      id='boundaries'
                      value='boundaries'
                      checked={boundariesOption}
                      onChange={(e) => {
                        onOptionChange?.('boundaries', e.target.checked);
                      }}
                    >
                      Boundaries
                    </OptionSwitch>
                  </DropMenuItem>
                </li>
              </DropMenu>
            </ContentGroupBody>
          </ContentGroup>

          <ContentGroup>
            <ContentGroupHeader>
              <ContentGroupTitle>Projection</ContentGroupTitle>
            </ContentGroupHeader>
            <ContentGroupBody>
              <DropMenu as='ol'>
                {projectionsList.map((proj) => {
                  if (proj.isCustom && proj.conicValues) {
                    return (
                      <ProjectionItemCustom
                        key={proj.id}
                        onChange={onProjectionChange}
                        id={proj.id}
                        label={proj.label}
                        defaultConicValues={proj.conicValues}
                        activeProjection={projection}
                      />
                    );
                  } else if (proj.conicValues) {
                    return (
                      <ProjectionItemConic
                        key={proj.id}
                        onChange={onProjectionChange}
                        id={proj.id}
                        label={proj.label}
                        defaultConicValues={proj.conicValues}
                        activeProjection={projection}
                      />
                    );
                  } else {
                    return (
                      <ProjectionItemSimple
                        key={proj.id}
                        onChange={onProjectionChange}
                        id={proj.id}
                        label={proj.label}
                        activeProjection={projection}
                      />
                    );
                  }
                })}
              </DropMenu>
            </ContentGroupBody>
          </ContentGroup>
        
      </DropBody>
    </MapOptionsDropdown>
  );
}

export default MapOptions;

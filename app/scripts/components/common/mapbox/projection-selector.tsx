import * as React from 'react';
import styled from 'styled-components';
import { CollecticonGlobe } from '@devseed-ui/collecticons';
import { Dropdown, DropMenu, DropTitle } from '@devseed-ui/dropdown';
import { Button, createButtonStyles } from '@devseed-ui/button';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';

import {
  ProjectionItemConic,
  ProjectionItemCustom,
  ProjectionItemSimple
} from './projection-selector-items';
import {
  MbProjectionOptions,
  ProjectionListItem,
  ProjectionOptions,
  ProjectionSelectorProps
} from './projection-selector.types';

const DropHeader = styled.div`
  padding: ${glsp()};
  box-shadow: inset 0 -1px 0 0 ${themeVal('color.base-100a')};
`;

const DropBody = styled.div`
  padding: ${glsp(0, 0, 1, 0)};
`;

/**
 * Override Dropdown styles to play well with the shadow scrollbar.
 */
const DropdownWithScroll = styled(Dropdown)`
  padding: 0;

  ${DropTitle} {
    margin: 0;
  }

  ${DropMenu} {
    margin: 0;
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

// The id is internal to the app.
// The mbId is the projection name to use with mapbox. This is needed because
// multiple projections can be made from the same mapbox Id just by tweaking the
// parallels and center values
export const projectionsList: ProjectionListItem[] = [
  { id: 'globe', mbId: 'globe', label: 'Globe' },
  {
    id: 'albers',
    mbId: 'albers',
    label: 'Albers',
    conicValues: {
      center: [-96, 37.5],
      parallels: [29.5, 45.5]
    }
  },
  { id: 'equalEarth', mbId: 'equalEarth', label: 'Equal Earth' },
  { id: 'equirectangular', mbId: 'equirectangular', label: 'Equirectangular' },
  {
    id: 'lambertConformalConic',
    mbId: 'lambertConformalConic',
    label: 'Lambert Conformal Conic',
    conicValues: {
      center: [0, 30],
      parallels: [30, 30]
    }
  },
  { id: 'mercator', mbId: 'mercator', label: 'Mercator' },
  { id: 'naturalEarth', mbId: 'naturalEarth', label: 'Natural Earth' },
  { id: 'winkelTripel', mbId: 'winkelTripel', label: 'Winkel Tripel' },
  {
    id: 'polarNorth',
    mbId: 'lambertConformalConic',
    label: 'Polar North',
    isCustom: true,
    conicValues: {
      center: [-40, 0],
      parallels: [90, 90]
    }
  },
  {
    id: 'polarSouth',
    mbId: 'lambertConformalConic',
    label: 'Polar South',
    isCustom: true,
    conicValues: {
      center: [-40, 0],
      parallels: [-89.99, -89.99]
    }
  }
];

/**
 * Return the correct format needed by mapbox to display the projection. We use
 * custom projections that do not exist in mapbox and therefore we need to get
 * the correct name and parallels and center values.
 * For example the projection with id polarNorth is actually named
 * lambertConformalConic
 */
export const convertProjectionToMapbox = (
  projection: ProjectionOptions
): MbProjectionOptions => {
  const p = projectionsList.find((proj) => proj.id === projection.id);

  if (!p) {
    /* eslint-disable-next-line no-console */
    console.error('projection', projection);
    throw new Error(`Invalid projection with id: ${projection.id}`);
  }

  return {
    ...projection,
    name: p.mbId
  };
};

// Default value for the projection state.
export const projectionDefault: ProjectionOptions = {
  id: 'mercator'
};

const shadowScrollbarProps = {
  autoHeight: true,
  autoHeightMax: 320
};

function ProjectionSelector(props: ProjectionSelectorProps) {
  const { projection, onChange } = props;

  return (
    <DropdownWithScroll
      triggerElement={(bag) => (
        <SelectorButton {...bag}>
          <CollecticonGlobe meaningful title='Select projection to use' />
        </SelectorButton>
      )}
      direction='down'
      alignment='left'
    >
      <DropHeader>
        <DropTitle>Map projections</DropTitle>
      </DropHeader>
      <DropBody>
        <ShadowScrollbar scrollbarsProps={shadowScrollbarProps}>
          <DropMenu>
            {projectionsList.map((proj) => {
              if (proj.isCustom && proj.conicValues) {
                return (
                  <ProjectionItemCustom
                    key={proj.id}
                    onChange={onChange}
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
                    onChange={onChange}
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
                    onChange={onChange}
                    id={proj.id}
                    label={proj.label}
                    activeProjection={projection}
                  />
                );
              }
            })}
          </DropMenu>
        </ShadowScrollbar>
      </DropBody>
    </DropdownWithScroll>
  );
}

export default ProjectionSelector;

export function validateProjectionBlockProps({
  name,
  center,
  parallels
}: Partial<ProjectionOptions>) {
  // Projections
  const projectionErrors: string[] = [];
  if (name) {
    const allowedProjections = projectionsList.map((p) => p.id);
    const projectionsConic = projectionsList
      .filter((p) => p.isConic)
      .map((p) => p.id);

    if (!allowedProjections.includes(name)) {
      const a = allowedProjections.join(', ');
      projectionErrors.push(`- Invalid projectionName. Must be one of: ${a}.`);
    }

    if (projectionsConic.includes(name)) {
      if (!center || !validateLon(center[0]) || !validateLat(center[1])) {
        const o = projectionsConic.join(', ');
        projectionErrors.push(
          `- Invalid projectionCenter. This property is required for ${o} projections. Use [longitude, latitude].`
        );
      }

      if (
        !parallels ||
        !validateLat(parallels[0]) ||
        !validateLat(parallels[1])
      ) {
        const o = projectionsConic.join(', ');
        projectionErrors.push(
          `- Invalid projectionParallels. This property is required for ${o} projections. Use [Southern parallel latitude, Northern parallel latitude].`
        );
      }
    }
  }

  return projectionErrors;
}

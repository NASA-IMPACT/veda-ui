import React from 'react';
import styled from 'styled-components';
import mapboxgl from 'mapbox-gl';
import { CollecticonGlobe } from '@devseed-ui/collecticons';
import {
  Dropdown,
  DropMenu,
  DropMenuItem,
  DropTitle
} from '@devseed-ui/dropdown';
import { Button, createButtonStyles } from '@devseed-ui/button';
import { glsp } from '@devseed-ui/theme-provider';
import { FormFieldsetHeader, FormLegend } from '@devseed-ui/form';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';

import { FormFieldsetBodyColumns, FormFieldsetCompact } from '$styles/fieldset';
import StressedFormGroupInput from '../stressed-form-group-input';
import { validateRangeNum } from '$utils/utils';

import { useState } from 'react';

const ProjectionOptions = styled.div`
  padding: ${glsp(0, 1)};

  ${FormFieldsetHeader} {
    padding-top: ${glsp(0.5)};
    padding-bottom: 0;
    border: none;
  }

  ${FormFieldsetBodyColumns} {
    padding-top: ${glsp(0.5)};
    padding-bottom: ${glsp(0.5)};
  }
`;

/**
 * Override Dropdown styles to play well with the shadow scrollbar.
 */
const DropdownWithScroll = styled(Dropdown)`
  padding: 0;

  ${DropTitle} {
    margin: 0;
    padding: ${glsp(1, 1, 0, 1)};
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

export type Projection = Exclude<
  mapboxgl.MapboxOptions['projection'],
  undefined
>;

export type ProjectionName = Projection['name'];

export const projectionsList: {
  id: ProjectionName;
  label: string;
  isConic?: boolean;
}[] = [
  { id: 'globe', label: 'Globe' },
  { id: 'albers', label: 'Albers', isConic: true },
  { id: 'equalEarth', label: 'Equal Earth' },
  { id: 'equirectangular', label: 'Equirectangular' },
  {
    id: 'lambertConformalConic',
    label: 'Lambert Conformal Conic',
    isConic: true
  },
  { id: 'mercator', label: 'Mercator' },
  { id: 'naturalEarth', label: 'Natural Earth' },
  { id: 'winkelTripel', label: 'Winkel Tripel' }
];

// The conic projections require additional values.
const projectionConicDefault = {
  albers: {
    center: [-96, 37.5],
    parallels: [29.5, 45.5]
  },
  lambertConformalConic: {
    center: [0, 30],
    parallels: [30, 30]
  }
};

const validateLon = validateRangeNum(-180, 180);
const validateLat = validateRangeNum(-90, 90);

const projectionConicCenter = [
  { id: 'lng', label: 'Center Longitude', validate: validateLon },
  { id: 'lat', label: 'Center Latitude', validate: validateLat }
];

const projectionConicParallel = [
  { id: 'sParLat', label: 'Southern Parallel Lat', validate: validateLat },
  { id: 'nParLat', label: 'Northern Parallel Lat', validate: validateLat }
];

// Default value for the projection state.
export const projectionDefault: Projection = {
  name: 'mercator'
};

const shadowScrollbarProps = {
  autoHeight: true,
  autoHeightMax: 320
};

function ProjectionSelector(props: ProjectionSelectorProps) {
  const { projection, onChange } = props;

  // Keep the values the user enters to be able to restore them whenever they
  // switch projections.
  const [conicValues, setConicValues] = useState(projectionConicDefault);

  // Store the conic values for the selected projection and register the change
  // for the parent.
  const onChangeConicValues = (value, projName, field, idx) => {
    const newConic = {
      ...conicValues[projName],
      [field]: Object.assign([], conicValues[projName][field], {
        [idx]: value
      })
    };
    setConicValues((v) => ({
      ...v,
      [projName]: newConic
    }));
    onChange({ ...projection, ...newConic });
  };

  return (
    <DropdownWithScroll
      triggerElement={({ active, ...bag }) => (
        <SelectorButton active={active as boolean} {...bag}>
          <CollecticonGlobe meaningful title='Select projection to use' />
        </SelectorButton>
      )}
      direction='down'
      alignment='left'
    >
      <DropTitle>Map projections</DropTitle>
      <ShadowScrollbar scrollbarsProps={shadowScrollbarProps}>
        <DropMenu>
          {projectionsList.map((proj) => (
            <li key={proj.id}>
              <DropMenuItem
                active={proj.id === projection.name}
                href='#'
                // data-dropdown='click.close'
                onClick={(e) => {
                  e.preventDefault();
                  if (proj.isConic) {
                    onChange({
                      ...conicValues[proj.id],
                      name: proj.id
                    });
                  } else {
                    onChange({ name: proj.id });
                  }
                }}
              >
                {proj.label}
              </DropMenuItem>
              {proj.isConic && proj.id === projection.name && (
                <ProjectionOptions>
                  <FormFieldsetCompact>
                    <FormFieldsetHeader>
                      <FormLegend>Center Lon/Lat</FormLegend>
                    </FormFieldsetHeader>
                    <FormFieldsetBodyColumns>
                      {projectionConicCenter.map((field, idx) => (
                        <StressedFormGroupInput
                          key={field.id}
                          hideHeader
                          inputType='text'
                          inputSize='small'
                          id={`center-${field.id}`}
                          name={`center-${field.id}`}
                          label={field.label}
                          value={conicValues[proj.id].center?.[idx]}
                          validate={field.validate}
                          onChange={(value) => {
                            onChangeConicValues(
                              Number(value),
                              proj.id,
                              'center',
                              idx
                            );
                          }}
                        />
                      ))}
                    </FormFieldsetBodyColumns>
                  </FormFieldsetCompact>
                  <FormFieldsetCompact>
                    <FormFieldsetHeader>
                      <FormLegend>S/N Parallels</FormLegend>
                    </FormFieldsetHeader>
                    <FormFieldsetBodyColumns>
                      {projectionConicParallel.map((field, idx) => (
                        <StressedFormGroupInput
                          key={field.id}
                          hideHeader
                          inputType='text'
                          inputSize='small'
                          id={`parallels-${field.id}`}
                          name={`parallels-${field.id}`}
                          label={field.label}
                          value={conicValues[proj.id].parallels?.[idx]}
                          validate={field.validate}
                          onChange={(value) => {
                            onChangeConicValues(
                              Number(value),
                              proj.id,
                              'parallels',
                              idx
                            );
                          }}
                        />
                      ))}
                    </FormFieldsetBodyColumns>
                  </FormFieldsetCompact>
                </ProjectionOptions>
              )}
            </li>
          ))}
        </DropMenu>
      </ShadowScrollbar>
    </DropdownWithScroll>
  );
}

export default ProjectionSelector;

type ProjectionSelectorProps = {
  onChange: (projection: Projection) => void;
  projection: Projection;
};

export function validateProjectionBlockProps({
  name,
  center,
  parallels
}: Partial<Projection>) {
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

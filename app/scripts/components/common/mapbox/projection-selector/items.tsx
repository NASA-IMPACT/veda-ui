import React, { useState } from 'react';
import styled from 'styled-components';
import { DropMenuItem } from '@devseed-ui/dropdown';
import { glsp } from '@devseed-ui/theme-provider';
import { FormFieldsetHeader, FormLegend } from '@devseed-ui/form';

import StressedFormGroupInput from '../../stressed-form-group-input';

import {
  ProjectionItemConicProps,
  ProjectionItemProps
} from './types';
import { validateLat, validateLon } from './utils';
import { FormFieldsetBodyColumns, FormFieldsetCompact } from '$styles/fieldset';

const ProjectionOptionsForm = styled.div`
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

const projectionConicCenter = [
  { id: 'lng', label: 'Center Longitude', validate: validateLon },
  { id: 'lat', label: 'Center Latitude', validate: validateLat }
];

const projectionConicParallel = [
  { id: 'sParLat', label: 'Southern Parallel Lat', validate: validateLat },
  { id: 'nParLat', label: 'Northern Parallel Lat', validate: validateLat }
];

export function ProjectionItemSimple(props: ProjectionItemProps) {
  const { onChange, id, label, activeProjection } = props;

  return (
    <li>
      <DropMenuItem
        active={id === activeProjection.id}
        href='#'
        onClick={(e) => {
          e.preventDefault();
          onChange({ id });
        }}
      >
        {label}
      </DropMenuItem>
    </li>
  );
}

export function ProjectionItemConic(props: ProjectionItemConicProps) {
  const { onChange, id, label, defaultConicValues, activeProjection } = props;

  const isActive = id === activeProjection.id;

  const activeConicValues = isActive && activeProjection.center
    ? {
        center: activeProjection.center,
        parallels: activeProjection.parallels
      }
    : null;

  // Keep the values the user enters to be able to restore them whenever they
  // switch projections.
  const [conicValues, setConicValues] = useState(
    activeConicValues ?? defaultConicValues
  );

  // Store the conic values for the selected projection and register the change
  // for the parent.
  const onChangeConicValues = (value, field, idx) => {
    const newConic = {
      ...conicValues,
      [field]: Object.assign([], conicValues[field], {
        [idx]: value
      })
    };
    setConicValues(newConic);
    onChange({ id, ...newConic });
  };

  return (
    <li>
      <DropMenuItem
        active={isActive}
        href='#'
        // data-dropdown='click.close'
        onClick={(e) => {
          e.preventDefault();
          onChange({
            ...conicValues,
            id
          });
        }}
      >
        {label}
      </DropMenuItem>
      {isActive && (
        <ProjectionOptionsForm>
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
                  value={conicValues.center?.[idx]}
                  validate={field.validate}
                  onChange={(value) => {
                    onChangeConicValues(Number(value), 'center', idx);
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
                  value={conicValues.parallels?.[idx].toString() ?? ''}
                  validate={field.validate}
                  onChange={(value) => {
                    onChangeConicValues(Number(value), 'parallels', idx);
                  }}
                />
              ))}
            </FormFieldsetBodyColumns>
          </FormFieldsetCompact>
        </ProjectionOptionsForm>
      )}
    </li>
  );
}

export function ProjectionItemCustom(props: ProjectionItemConicProps) {
  const { onChange, id, label, defaultConicValues, activeProjection } = props;

  return (
    <li>
      <DropMenuItem
        active={id === activeProjection.id}
        href='#'
        onClick={(e) => {
          e.preventDefault();
          onChange({ id, ...defaultConicValues });
        }}
      >
        {label}
      </DropMenuItem>
    </li>
  );
}

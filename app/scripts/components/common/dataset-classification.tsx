import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { Icon } from '@trussworks/react-uswds';

import { Tip } from './tip';
import {
  ProgressTickHighIcon,
  ProgressTickLowIcon,
  ProgressTickMediumIcon
} from './custom-icon';
import { DatasetData } from '$types/veda';

import { variableGlsp } from '$styles/variable-utils';
import {
  getTaxonomy,
  TAXONOMY_GRADE,
  TAXONOMY_UNCERTAINTY
} from '$utils/veda-data/taxonomies';

const DATA_UNCERTAINTY = {
  High: ProgressTickLowIcon,
  Medium: ProgressTickMediumIcon,
  Low: ProgressTickHighIcon
};

const DATA_GRADE = {
  Research: Icon.Science,
  'Agency standard/regulatory': Icon.Verified
};

const DatasetClassificationWrapper = styled.div`
  position: absolute;
  top: ${variableGlsp()};
  left: ${variableGlsp()};
  display: flex;
  gap: ${glsp(0.5)};

  svg {
    pointer-events: all;
    color: ${themeVal('color.surface')};
  }
`;

export function DatasetClassification(props: { dataset: DatasetData }) {
  const { dataset } = props;

  const grade = getTaxonomy(dataset, TAXONOMY_GRADE)?.values[0];
  const uncertainty = getTaxonomy(dataset, TAXONOMY_UNCERTAINTY)?.values[0];

  const IconUncertainty = DATA_UNCERTAINTY[uncertainty?.name ?? ''];
  const IconGrade = DATA_GRADE[grade?.name ?? ''];

  if (!IconUncertainty && !IconGrade) return null;

  return (
    <DatasetClassificationWrapper>
      {IconUncertainty && uncertainty && (
        <Tip content={`Uncertainty: ${uncertainty.name}`}>
          <IconUncertainty
            size={3}
            aria-label={`Uncertainty: ${uncertainty.name}`}
          />
        </Tip>
      )}
      {IconGrade && grade && (
        <Tip content={`Grade: ${grade.name}`}>
          <IconGrade size={3} aria-label={`Grade: ${grade.name}`} />
        </Tip>
      )}
    </DatasetClassificationWrapper>
  );
}

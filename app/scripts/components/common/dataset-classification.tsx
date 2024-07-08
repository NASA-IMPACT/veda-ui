import React from 'react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { Tip } from './tip';
import {
  CollecticonProgressTickHigh,
  CollecticonProgressTickLow,
  CollecticonProgressTickMedium
} from './icons/progress-tick';
import { CollecticonFlask } from './icons/flask';
import { CollecticonMedal } from './icons/medal';
import { DatasetData } from '$types/veda';

import { variableGlsp } from '$styles/variable-utils';
import {
  getTaxonomy,
  TAXONOMY_GRADE,
  TAXONOMY_UNCERTAINTY
} from '$utils/veda-data/taxonomies';

const DATA_UNCERTAINTY = {
  High: CollecticonProgressTickLow,
  Medium: CollecticonProgressTickMedium,
  Low: CollecticonProgressTickHigh
};

const DATA_GRADE = {
  Research: CollecticonFlask,
  'Agency standard/regulatory': CollecticonMedal
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
            meaningful
            title={`Uncertainty: ${uncertainty.name}`}
          />
        </Tip>
      )}
      {IconGrade && grade && (
        <Tip content={`Grade: ${grade.name}`}>
          <IconGrade meaningful title={`Grade: ${grade.name}`} />
        </Tip>
      )}
    </DatasetClassificationWrapper>
  );
}

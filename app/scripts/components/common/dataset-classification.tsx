import React from 'react';
import styled from 'styled-components';
import { DatasetData } from 'veda';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { Tip } from './tip';
import {
  CollecticonProgressTickHigh,
  CollecticonProgressTickLow,
  CollecticonProgressTickMedium
} from './icons/progress-tick';
import { CollecticonFlask } from './icons/flask';
import { CollecticonMedal } from './icons/medal';

import { variableGlsp } from '$styles/variable-utils';
import {
  getTaxonomy,
  TAXONOMY_NATURE,
  TAXONOMY_UNCERTAINTY
} from '$utils/veda-data';

const DATA_UNCERTAINTY = {
  High: CollecticonProgressTickLow,
  Medium: CollecticonProgressTickMedium,
  Low: CollecticonProgressTickHigh
};

const DATA_NATURE = {
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

  const nature = getTaxonomy(dataset, TAXONOMY_NATURE)?.values[0];
  const uncertainty = getTaxonomy(dataset, TAXONOMY_UNCERTAINTY)?.values[0];

  const IconUncertainty = DATA_UNCERTAINTY[uncertainty?.name ?? ''];
  const IconNature = DATA_NATURE[nature?.name ?? ''];

  if (!IconUncertainty && !IconNature) return null;

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
      {IconNature && nature && (
        <Tip content={`Nature: ${nature.name}`}>
          <IconNature meaningful title={`Nature: ${nature.name}`} />
        </Tip>
      )}
    </DatasetClassificationWrapper>
  );
}

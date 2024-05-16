import React, { useEffect } from 'react';
import styled from 'styled-components';
import {
  ModalHeadline
} from '@devseed-ui/modal';
import { Heading } from '@devseed-ui/typography';

import BrowseControls from '$components/common/browse-controls';
import {
  Actions,
  TaxonomyFilterOption,
  useBrowserControls
} from '$components/common/browse-controls/use-browse-controls';
import {
  allExploreDatasetsWithEnhancedLayers as allDatasets
} from '$components/exploration/data-utils';
import { generateTaxonomies } from '$utils/veda-data';
import { sortOptions } from '$components/common/catalog';

const StyledModalHeadline = styled(ModalHeadline)`
  width: 100%;
`;

export default function RenderModalHeader ({defaultSelect}: {defaultSelect?: TaxonomyFilterOption}) {
  const controlVars = useBrowserControls({
    sortOptions
  });
  const datasetTaxonomies = generateTaxonomies(allDatasets);
  useEffect(() => {
    if (defaultSelect) {
      controlVars.onAction(Actions.TAXONOMY, { key: defaultSelect.taxonomyType, value: defaultSelect.value });
    }
  }, [defaultSelect]);

  return(
    <StyledModalHeadline>
      <Heading size='small'>Data layers</Heading>
      <BrowseControls
          {...controlVars}
          taxonomiesOptions={datasetTaxonomies}
      />
    </StyledModalHeadline>
  );
}
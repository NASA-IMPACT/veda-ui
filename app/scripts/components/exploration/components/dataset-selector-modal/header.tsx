import React from 'react';
import styled from 'styled-components';
import { datasetTaxonomies } from 'veda';
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
import { sortOptions } from '$components/data-catalog';

const StyledModalHeadline = styled(ModalHeadline)`
  width: 100%;
`;

export default function RenderModalHeader ({defaultSelect}: {defaultSelect?: TaxonomyFilterOption}) {
  const controlVars = useBrowserControls({
    sortOptions
  });

  React.useEffect(() => {
    if(defaultSelect) {
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
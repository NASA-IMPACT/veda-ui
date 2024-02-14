import React from 'react';
import styled from 'styled-components';
import { datasetTaxonomies } from 'veda';
import {
  ModalHeadline
} from '@devseed-ui/modal';

import { Heading } from '@devseed-ui/typography';
import BrowseControls from '$components/common/browse-controls';
import {
  useBrowserControls
} from '$components/common/browse-controls/use-browse-controls';
import { sortOptions } from '$components/data-catalog';

const StyledModalHeadline = styled(ModalHeadline)``;
const ModalIntro = styled.div``;

export default function RenderModalHeader () {
  const controlVars = useBrowserControls({
    sortOptions
  });
  
  return(
    <StyledModalHeadline>
      <Heading size='small'>Data layers</Heading>
      <ModalIntro>
          <p>This tool allows the exploration and analysis of time-series datasets in raster format. For a comprehensive list of available datasets, please visit the Data Catalog.</p>
      </ModalIntro>
      <BrowseControls
            {...controlVars}
            taxonomiesOptions={datasetTaxonomies}
            sortOptions={sortOptions}
      />
    </StyledModalHeadline>
  );
}
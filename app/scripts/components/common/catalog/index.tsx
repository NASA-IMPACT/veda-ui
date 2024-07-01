import React from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import CatalogContent from './catalog-content';
import { useFiltersWithQS } from './controls/hooks/use-filters-with-query';
import { DatasetData } from '$types/veda';
import {
  useSlidingStickyHeaderProps
} from '$components/common/layout-root/useSlidingStickyHeaderProps';

import {
  FoldHeader,
  FoldHeadline,
  FoldTitle
} from '$components/common/fold';
import { variableGlsp } from '$styles/variable-utils';

/**
 * CATALOG Feature component
 * Allows you to browse through datasets and layers using the filters sidebar control
 */

const CatalogWrapper = styled.div`
  width: 100%;
  max-width: ${themeVal('layout.max')};
  margin: 0 auto;
  margin-top: ${variableGlsp(2)};
  padding-left: ${variableGlsp()};
  padding-right: ${variableGlsp()};
  gap: ${variableGlsp()};
`;

const CatalogFoldHeader = styled(FoldHeader)`
  margin-bottom: 4rem;
`;

export const sortOptions = [{ id: 'name', name: 'Name' }];

export interface CatalogViewProps {
  datasets: DatasetData[];
}

function CatalogView({
  datasets,
}: CatalogViewProps) {

  const { headerHeight } = useSlidingStickyHeaderProps();
  const { search, taxonomies , onAction } = useFiltersWithQS();

  return (
    <CatalogWrapper>
      <CatalogFoldHeader
        style={{
          scrollMarginTop: `${headerHeight + 16}px`
        }}
      >
        <FoldHeadline>
          <FoldTitle>Search datasets</FoldTitle>
        </FoldHeadline>
      </CatalogFoldHeader>
      <CatalogContent
        datasets={datasets}
        search={search}
        taxonomies={taxonomies}
        onAction={onAction}
      />
    </CatalogWrapper>
  );
}

export default CatalogView;
import React, { lazy } from 'react';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';
import { DatasetData } from '$types/veda';
import { useSlidingStickyHeaderProps } from '$components/common/layout-root/useSlidingStickyHeaderProps';

import { FoldHeader, FoldHeadline, FoldTitle } from '$components/common/fold';
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

const CatalogContent = lazy(() => import('./catalog-content'));
const CatalogContentLegacy = lazy(() => import('./catalog-legacy/catalog-content'));

export interface CatalogViewProps {
  datasets: DatasetData[];
  onFilterChanges: () =>
    | {
        search: string;
        taxonomies: Record<string, string[]> | Record<string, never>;
        onAction: () => void;
      }
    | any;
  enableUSWDSDataCatalog: boolean;
}

function CatalogView({
  datasets,
  onFilterChanges,
  enableUSWDSDataCatalog
}: CatalogViewProps) {
  const { headerHeight } = useSlidingStickyHeaderProps();

  const { search, taxonomies, onAction } = onFilterChanges();

  const headerElement = (
    <CatalogFoldHeader
      style={{
        scrollMarginTop: `${headerHeight + 16}px`
      }}
    >
      <FoldHeadline>
        <FoldTitle>Search datasets</FoldTitle>
      </FoldHeadline>
    </CatalogFoldHeader>
  );
  return (
    <CatalogWrapper>
      {enableUSWDSDataCatalog ? (
        <div className='display-none tablet:display-block'>{headerElement}</div>
      ) : (
        headerElement
      )}
      {enableUSWDSDataCatalog ? (
        <CatalogContent
          datasets={datasets}
          search={search}
          taxonomies={taxonomies}
          onAction={onAction}
        />
      ) : (
        <CatalogContentLegacy
          datasets={datasets}
          search={search}
          taxonomies={taxonomies}
          onAction={onAction}
        />
      )}
    </CatalogWrapper>
  );
}

export default CatalogView;

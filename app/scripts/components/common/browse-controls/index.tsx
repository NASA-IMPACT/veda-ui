import React from 'react';
import styled from 'styled-components';
import { Taxonomy } from 'veda';
import { Overline } from '@devseed-ui/typography';
import { Button, ButtonProps } from '@devseed-ui/button';
import {
  CollecticonChevronDownSmall,
  CollecticonChevronUpSmall
} from '@devseed-ui/collecticons';
import { glsp, truncated } from '@devseed-ui/theme-provider';
import { DropMenu, DropTitle } from '@devseed-ui/dropdown';

import { useFiltersWithQS } from '../catalog/controls/hooks/use-filters-with-query';
import { optionAll } from './constants';
import { FilterActions } from '$components/common/catalog/utils';

import DropdownScrollable from '$components/common/dropdown-scrollable';
import DropMenuItemButton from '$styles/drop-menu-item-button';
import { variableGlsp } from '$styles/variable-utils';
import SearchField from '$components/common/search-field';
import { useMediaQuery } from '$utils/use-media-query';

export interface FilterOption {
  id: string;
  name: string;
}

const BrowseControlsWrapper = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${variableGlsp(0.25)};
  padding-top: ${variableGlsp(0.5)};
`;

const SearchWrapper = styled.div`
  display: flex;
  gap: ${variableGlsp(0.5)};
  flex-wrap: no-wrap;
`;

const FilterOptionsWrapper = styled.div`
  display: flex;
  gap: ${variableGlsp(0.5)};
  > * {
    flex-shrink: 0;
  }
`;

const DropButton = styled(Button)`
  max-width: 12rem;
  > span {
    max-width: 5rem;
    ${truncated()}
  }

  > svg {
    flex-shrink: 0;
  }
`;

const MainDropButton = styled(DropButton)`
  > * {
    flex-shrink: 0;
  }
`;

const ButtonPrefix = styled(Overline).attrs({ as: 'small' })`
  margin-right: ${glsp(0.25)};
  white-space: nowrap;
`;

interface BrowseControlsProps extends ReturnType<typeof useFiltersWithQS> {
  taxonomiesOptions: Taxonomy[];
}

function BrowseControls(props: BrowseControlsProps) {
  const {
    taxonomiesOptions,
    taxonomies,
    search,
    onAction,
    ...rest
  } = props;

  const { isLargeUp } = useMediaQuery();
  const filterWrapConstant = 4;
  const wrapTaxonomies = taxonomiesOptions.length > filterWrapConstant; // wrap list of taxonomies when more then 4 filter options


  const createFilterList = (filterList: Taxonomy[]) => {
    return filterList.map(({ name, values }) => (
      <DropdownOptions
        key={name}
        prefix={name}
        items={[optionAll].concat(values)}
        currentId={(taxonomies[name]? taxonomies[name] as unknown as string : 'all')}
        onChange={(v) => {
          onAction(FilterActions.TAXONOMY, { key: name, value: v });
        }}
        size={isLargeUp ? 'large' : 'medium'}
      />
    ));
  };

  return (
    <BrowseControlsWrapper {...rest}>
      <SearchWrapper>
        <SearchField
          size={isLargeUp ? 'large' : 'medium'}
          placeholder='Title, description...'
          keepOpen={isLargeUp}
          value={search}
          onChange={(v) => onAction(FilterActions.SEARCH, v)}
        />
        <FilterOptionsWrapper>
          {createFilterList(taxonomiesOptions.slice(0, filterWrapConstant))}
        </FilterOptionsWrapper>
      </SearchWrapper>
      {
        wrapTaxonomies && (
          <FilterOptionsWrapper>
            {createFilterList(taxonomiesOptions.slice(filterWrapConstant, taxonomiesOptions.length))}
          </FilterOptionsWrapper>
        )
      }
    </BrowseControlsWrapper>
  );
}

export default styled(BrowseControls)`
  /* Convert to styled-component: https://styled-components.com/docs/advanced#caveat */
`;

interface DropdownOptionsProps {
  size: ButtonProps['size'];
  items: FilterOption[];
  currentId?: string;
  onChange: (value: FilterOption['id']) => void;
  prefix: string;
}

function DropdownOptions(props: DropdownOptionsProps) {
  const { size, items, currentId, onChange, prefix } = props;
  const currentItem = items.find((d) => d.id === currentId);

  return (
    <DropdownScrollable
      alignment='left'
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      triggerElement={({ active, className, ...rest }) => (
        <MainDropButton
          variation='base-outline'
          size={size}
          active={active}
          {...rest}
        >
          <ButtonPrefix>{prefix}</ButtonPrefix>
          <span>{currentItem?.name}</span>{' '}
          {active ? (
            <CollecticonChevronUpSmall />
          ) : (
            <CollecticonChevronDownSmall />
          )}
        </MainDropButton>
      )}
    >
      <DropTitle>Options</DropTitle>
      <DropMenu>
        {items.map((t) => (
          <li key={t.id}>
            <DropMenuItemButton
              active={t.id === currentItem?.id}
              data-dropdown='click.close'
              onClick={() => onChange(t.id)}
            >
              {t.name}
            </DropMenuItemButton>
          </li>
        ))}
      </DropMenu>
    </DropdownScrollable>
  );
}

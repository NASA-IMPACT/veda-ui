import React, { useState } from 'react';
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

import {
  Actions,
  FilterOption,
  optionAll,
  sortDirOptions,
  useBrowserControls
} from './use-browse-controls';

import DropdownScrollable from '$components/common/dropdown-scrollable';
import DropMenuItemButton from '$styles/drop-menu-item-button';
import { variableGlsp } from '$styles/variable-utils';
import SearchField from '$components/common/search-field';
import { useMediaQuery } from '$utils/use-media-query';

const BrowseControlsWrapper = styled.div`
  display: flex;
  flex-flow: column;
  gap: ${variableGlsp(0.25)};
  padding-top: ${variableGlsp(0.5)};
`;

const SearchWrapper = styled.div`
  display: flex;
  gap: ${variableGlsp(0.5)};
  width: 100%;
  max-width: 70rem;
`;

const TaxonomyWrapper = styled.div`
  display: flex;
  flex-flow: row wrap;
  gap: ${variableGlsp(0.5)};

  > * {
    flex-shrink: 0;
  }
`;

const DropButton = styled(Button)`
  max-width: 12rem;
  > span {
    ${truncated()}
  }

  > svg {
    flex-shrink: 0;
  }
`;
const MainDropButton = styled(DropButton)`
  width: 15rem;
  max-width: 15rem;
`;

const ShowMorebutton = styled(Button)`
  width: 10rem;
  max-width: 10rem;
  text-decoration: underline;
`;

const ButtonPrefix = styled(Overline).attrs({ as: 'small' })`
  margin-right: ${glsp(0.25)};
  white-space: nowrap;
`;

interface BrowseControlsProps extends ReturnType<typeof useBrowserControls> {
  taxonomiesOptions: Taxonomy[];
  sortOptions: FilterOption[];
  showMoreButtonOpt?: boolean;
}

function BrowseControls(props: BrowseControlsProps) {
  const [ showFilters, setShowFilters ] = useState(false);
  const {
    taxonomiesOptions,
    taxonomies,
    sortOptions,
    search,
    showMoreButtonOpt,
    sortField,
    sortDir,
    onAction,
    ...rest
  } = props;

  const currentSortField = sortOptions.find((s) => s.id === sortField)!;

  const { isLargeUp } = useMediaQuery();

  return (  
    <BrowseControlsWrapper {...rest}>
      <SearchWrapper>
        <SearchField
          size={isLargeUp ? 'large' : 'medium'}
          placeholder='Title, description...'
          keepOpen={isLargeUp}
          value={search ?? ''}
          onChange={(v) => onAction(Actions.SEARCH, v)}
        />
        <DropdownScrollable
          alignment='left'
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          triggerElement={({ active, className, ...rest }) => (
            <MainDropButton
              variation='base-outline'
              size={isLargeUp ? 'large' : 'medium'}
              active={active}
              {...rest}
            >
              <ButtonPrefix>Sort by</ButtonPrefix>
              <span>{currentSortField.name}</span>{' '}
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
            {/* { @NOTE: Display the sort option labels only when there is more than one otherwise it already defaults to the button title} */}
            {sortOptions.length > 1 && sortOptions.map((t) => (
              <li key={t.id}>
                <DropMenuItemButton
                  active={t.id === sortField}
                  data-dropdown='click.close'
                  onClick={() => onAction(Actions.SORT_FIELD, t.id)}
                >
                  {t.name}
                </DropMenuItemButton>
              </li>
            ))}
          </DropMenu>
          <DropMenu>
            {sortDirOptions.map((t) => (
              <li key={t.id}>
                <DropMenuItemButton
                  active={t.id === sortDir}
                  data-dropdown='click.close'
                  onClick={() => onAction(Actions.SORT_DIR, t.id)}
                >
                  {t.name}
                </DropMenuItemButton>
              </li>
            ))}
          </DropMenu>
        </DropdownScrollable>
        {
          showMoreButtonOpt && (
            <ShowMorebutton
              variation='base-text'
              size={isLargeUp ? 'large' : 'medium'}
              fitting='skinny'
              onClick={() => {setShowFilters(value => !value);}}
            >
              {showFilters? 'Hide filters' : 'Show filters'}
            </ShowMorebutton>
          )
        }
      </SearchWrapper>
      {showFilters && 
        <TaxonomyWrapper>
          {taxonomiesOptions.map(({ name, values }) => (
            <DropdownOptions
              key={name}
              prefix={name}
              items={[optionAll].concat(values)}
              currentId={taxonomies?.[name] ?? 'all'}
              onChange={(v) => {
                onAction(Actions.TAXONOMY, { key: name, value: v });
              }}
              size={isLargeUp ? 'large' : 'medium'}
            />
          ))}
        </TaxonomyWrapper>}
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
        <DropButton
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
        </DropButton>
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

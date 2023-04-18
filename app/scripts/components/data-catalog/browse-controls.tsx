import React from 'react';
import styled from 'styled-components';
import { Overline } from '@devseed-ui/typography';
import { FormGroupStructure } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import {
  CollecticonChevronDownSmall,
  CollecticonChevronUpSmall
} from '@devseed-ui/collecticons';
import { glsp, truncated } from '@devseed-ui/theme-provider';
import { DropMenu, DropTitle } from '@devseed-ui/dropdown';

import {
  Actions,
  FilterOption,
  sortDirOptions,
  sortFieldsOptions,
  useBrowserControls
} from './use-browse-controls';

import DropdownScrollable from '$components/common/dropdown-scrollable';
import DropMenuItemButton from '$styles/drop-menu-item-button';
import { FoldHeadActions } from '$components/common/fold';
import SearchField from '$components/common/search-field';

const DropButton = styled(Button)`
  max-width: 14rem;

  > span {
    ${truncated()}
  }

  > svg {
    flex-shrink: 0;
  }
`;

const ButtonPrefix = styled(Overline).attrs({ as: 'small' })`
  margin-right: ${glsp(0.25)};
  white-space: nowrap;
`;

interface BrowseControlsProps extends ReturnType<typeof useBrowserControls> {
  topicsOptions: FilterOption[];
  sourcesOptions: FilterOption[];
}

function BrowseControls(props: BrowseControlsProps) {
  const {
    topic,
    source,
    topicsOptions,
    sourcesOptions,
    search,
    sortField,
    sortDir,
    onAction
  } = props;

  const currentSortField = sortFieldsOptions.find((s) => s.id === sortField)!;

  return (
    <FoldHeadActions>
      <DropdownOptions
        prefix='Topic'
        items={topicsOptions}
        currentId={topic}
        onChange={(v) => onAction(Actions.TOPIC, v)}
      />
      <DropdownOptions
        prefix='Source'
        items={sourcesOptions}
        currentId={source}
        onChange={(v) => onAction(Actions.SOURCE, v)}
      />
      <FormGroupStructure hideHeader id='browse-search' label='Search'>
        <SearchField
          id='browse-search'
          size='large'
          placeholder='Title, description...'
          // keepOpen
          value={search ?? ''}
          onChange={(v) => onAction(Actions.SEARCH, v)}
        />
      </FormGroupStructure>
      <DropdownScrollable
        alignment='right'
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        triggerElement={({ active, className, ...rest }) => (
          <DropButton
            variation='base-outline'
            size='large'
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
          </DropButton>
        )}
      >
        <DropTitle>Options</DropTitle>
        <DropMenu>
          {sortFieldsOptions.map((t) => (
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
    </FoldHeadActions>
  );
}

export default BrowseControls;

interface DropdownOptionsProps {
  items: FilterOption[];
  currentId: string | null;
  onChange: (value: FilterOption['id']) => void;
  prefix: string;
}

function DropdownOptions(props: DropdownOptionsProps) {
  const { items, currentId, onChange, prefix } = props;

  const currentItem = items.find((d) => d.id === currentId);

  return (
    <DropdownScrollable
      alignment='left'
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      triggerElement={({ active, className, ...rest }) => (
        <DropButton
          variation='base-outline'
          size='large'
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

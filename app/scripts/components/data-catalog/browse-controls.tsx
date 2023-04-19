import React from 'react';
import styled from 'styled-components';
import { Overline } from '@devseed-ui/typography';
import { Button, ButtonProps } from '@devseed-ui/button';
import {
  CollecticonChevronDownSmall,
  CollecticonChevronUpSmall
} from '@devseed-ui/collecticons';
import { glsp, media, truncated } from '@devseed-ui/theme-provider';
import { DropMenu, DropTitle } from '@devseed-ui/dropdown';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';

import {
  Actions,
  FilterOption,
  sortDirOptions,
  sortFieldsOptions,
  useBrowserControls
} from './use-browse-controls';

import DropdownScrollable from '$components/common/dropdown-scrollable';
import DropMenuItemButton from '$styles/drop-menu-item-button';
import { variableGlsp } from '$styles/variable-utils';
import { FoldHeadActions } from '$components/common/fold';
import SearchField from '$components/common/search-field';
import { useMediaQuery } from '$utils/use-media-query';


const BrowseControlsWrapper = styled(FoldHeadActions)`
  .search-field {
    order: -1;
  }

  ${media.largeUp`
    .search-field {
      order: initial;
    }
  `}
`;

const BrowseControlsShadowScrollbar = styled(ShadowScrollbar)`
  min-width: 0;
`;

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

const ShadowScrollbarInner = styled.div`
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: ${variableGlsp(0.5)};

  > * {
    flex-shrink: 0;
  }
`;

interface BrowseControlsProps extends ReturnType<typeof useBrowserControls> {
  topicsOptions: FilterOption[];
  sourcesOptions: FilterOption[];
}

const shadowScrollbarProps = {
  autoHeight: true
};

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

  const { isLargeUp } = useMediaQuery();

  return (
    <BrowseControlsWrapper>
      <BrowseControlsShadowScrollbar
        scrollbarsProps={shadowScrollbarProps}
        bottomShadowVariation='none'
        topShadowVariation='none'
      >
        <ShadowScrollbarInner>
          <DropdownOptions
            prefix='Topic'
            items={topicsOptions}
            currentId={topic}
            size={isLargeUp ? 'large' : 'medium'}
            onChange={(v) => onAction(Actions.TOPIC, v)}
          />
          <DropdownOptions
            prefix='Source'
            items={sourcesOptions}
            currentId={source}
            size={isLargeUp ? 'large' : 'medium'}
            onChange={(v) => onAction(Actions.SOURCE, v)}
          />
          <SearchField
            size={isLargeUp ? 'large' : 'medium'}
            placeholder='Title, description...'
            keepOpen={isLargeUp}
            value={search ?? ''}
            onChange={(v) => onAction(Actions.SEARCH, v)}
          />
          <DropdownScrollable
            alignment='right'
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            triggerElement={({ active, className, ...rest }) => (
              <DropButton
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
        </ShadowScrollbarInner>
      </BrowseControlsShadowScrollbar>
    </BrowseControlsWrapper>
  );
}

export default BrowseControls;

interface DropdownOptionsProps {
  size: ButtonProps['size'];
  items: FilterOption[];
  currentId: string | null;
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

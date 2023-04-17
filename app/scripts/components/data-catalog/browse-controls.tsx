import React from 'react';
import styled from 'styled-components';
import { Subtitle } from '@devseed-ui/typography';
import { FormGroupStructure, FormInput, FormSelect } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import {
  iconDataURI,
  CollecticonChevronUpSmall,
  CollecticonMagnifierRight
} from '@devseed-ui/collecticons';
import { truncated } from '@devseed-ui/theme-provider';
import { CollecticonChevronDownSmall } from '@devseed-ui/collecticons';
import { DropMenu, DropTitle } from '@devseed-ui/dropdown';

import {
  Actions,
  FilterOption,
  sortDirOptions,
  sortFieldsOptions,
  useBrowserControls
} from './use-browse-controls';

import { variableGlsp } from '$styles/variable-utils';
import DropdownScrollable from '$components/common/dropdown-scrollable';
import DropMenuItemButton from '$styles/drop-menu-item-button';

const DropButton = styled(Button)`
  width: 10rem;

  > span {
    ${truncated()}
  }

  > svg {
    flex-shrink: 0;
  }
`;

const ControlsWrapper = styled.div`
  grid-column: 1 / -1;
  display: flex;
  gap: ${variableGlsp()};
`;

const ControlGroup = styled.div`
  display: flex;
  flex-flow: column;
  gap: 1rem;

  &:first-child {
    margin-right: auto;
  }
`;

const ControlGroupBody = styled.div`
  display: flex;
  gap: 1rem;

  ${FormSelect} {
    ${truncated()}
    width: 10rem;
  }
`;

const FormInputIconified = styled.div`
  position: relative;

  &::after {
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translate(0, -50%);
    display: block;
    content: '';
    background-image: ${({ theme }) => {
      const uri = iconDataURI(CollecticonMagnifierRight, {
        color: theme.color?.base
      });
      return `url('${uri}')`;
    }};
    background-repeat: no-repeat;
    background-size: 1rem 1rem;
    width: 1rem;
    height: 1rem;
  }

  ${FormInput} {
    padding-right: 2.5rem;
  }
`;

const ControlGroupHeadline = styled.div`
  flex-basis: 100%;

  ${Subtitle} {
    text-transform: uppercase;
    font-weight: inherit;
  }
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
    <ControlsWrapper>
      <ControlGroup>
        <ControlGroupHeadline>
          <Subtitle as='h3'>Filter</Subtitle>
        </ControlGroupHeadline>
        <ControlGroupBody>
          <DropdownOptions
            items={topicsOptions}
            currentId={topic}
            onChange={(v) => onAction(Actions.TOPIC, v)}
          />
          <DropdownOptions
            items={sourcesOptions}
            currentId={source}
            onChange={(v) => onAction(Actions.SOURCE, v)}
          />
          <FormGroupStructure hideHeader id='browse-search' label='Topics'>
            <FormInputIconified>
              <FormInput
                id='browse-search'
                size='large'
                placeholder='Title, description...'
                value={search ?? ''}
                onChange={(e) => onAction(Actions.SEARCH, e.target.value)}
              />
            </FormInputIconified>
          </FormGroupStructure>
        </ControlGroupBody>
      </ControlGroup>
      <ControlGroup>
        <ControlGroupHeadline>
          <Subtitle as='h3'>Sort</Subtitle>
        </ControlGroupHeadline>
        <ControlGroupBody>
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
        </ControlGroupBody>
      </ControlGroup>
    </ControlsWrapper>
  );
}

export default BrowseControls;

interface DropdownOptionsProps {
  items: FilterOption[];
  currentId: string | null;
  onChange: (value: FilterOption['id']) => void;
}

function DropdownOptions(props: DropdownOptionsProps) {
  const { items, currentId, onChange } = props;

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

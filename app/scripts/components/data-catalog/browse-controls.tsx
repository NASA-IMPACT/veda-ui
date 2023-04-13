import React, { useState } from 'react';
import styled from 'styled-components';
import { Subtitle } from '@devseed-ui/typography';
import { FormGroupStructure, FormInput, FormSelect } from '@devseed-ui/form';
import { Button, ButtonGroup } from '@devseed-ui/button';
import {
  iconDataURI,
  CollecticonChevronUpSmall,
  CollecticonLayoutGrid2x2,
  CollecticonLayoutRow2x,
  CollecticonMagnifierRight
} from '@devseed-ui/collecticons';
import { truncated } from '@devseed-ui/theme-provider';
import { CollecticonChevronDownSmall } from '@devseed-ui/collecticons';
import { DropMenu, DropMenuItem, DropTitle } from '@devseed-ui/dropdown';

import { variableGlsp } from '$styles/variable-utils';
import DropdownScrollable from '$components/common/dropdown-scrollable';

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

const topicsOptions = [
  {
    id: 'all',
    name: 'All Topics'
  },
  {
    id: 'eis',
    name: 'Earth Information Systems'
  }
];

const sourcesOptions = [
  {
    id: 'all',
    name: 'All sources'
  },
  {
    id: 'eis',
    name: 'Earth Information Systems'
  }
];
const sortOptions = [
  {
    id: 'name',
    name: 'Name'
  },
  {
    id: 'date',
    name: 'Date'
  }
];

function BrowseControls() {
  const [viewMode, setViewMode] = useState('card');

  return (
    <ControlsWrapper>
      <ControlGroup>
        <ControlGroupHeadline>
          <Subtitle as='h3'>Filter</Subtitle>
        </ControlGroupHeadline>
        <ControlGroupBody>
          <DropdownOptions
            items={topicsOptions}
            currentItem={topicsOptions[1]}
          />
          <DropdownOptions
            items={sourcesOptions}
            currentItem={sourcesOptions[0]}
          />
          <FormGroupStructure hideHeader id='browse-search' label='Topics'>
            <FormInputIconified>
              <FormInput
                id='browse-search'
                size='large'
                placeholder='Title, description...'
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
          <DropdownOptions items={sortOptions} currentItem={sortOptions[0]} />
        </ControlGroupBody>
      </ControlGroup>
      <ControlGroup>
        <ControlGroupHeadline>
          <Subtitle as='h3'>View</Subtitle>
        </ControlGroupHeadline>
        <ControlGroupBody>
          <ButtonGroup size='large'>
            <Button
              fitting='skinny'
              variation={viewMode === 'card' ? 'base-fill' : 'base-outline'}
              onClick={() => setViewMode('card')}
            >
              <CollecticonLayoutGrid2x2 title='Toggle card view' meaningful />
            </Button>
            <Button
              fitting='skinny'
              variation={viewMode === 'list' ? 'base-fill' : 'base-outline'}
              onClick={() => setViewMode('list')}
            >
              <CollecticonLayoutRow2x title='Toggle list view' meaningful />
            </Button>
          </ButtonGroup>
        </ControlGroupBody>
      </ControlGroup>
    </ControlsWrapper>
  );
}

export default BrowseControls;

interface DropdownOptionsItem {
  id: string;
  name: string;
}

interface DropdownOptionsProps {
  items: DropdownOptionsItem[];
  currentItem: DropdownOptionsItem;
}

function DropdownOptions(props: DropdownOptionsProps) {
  const { items, currentItem } = props;

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
          <span>{currentItem.name}</span>{' '}
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
            <DropMenuItem
              active={t.id === currentItem.id}
              data-dropdown='click.close'
            >
              {t.name}
            </DropMenuItem>
          </li>
        ))}
      </DropMenu>
    </DropdownScrollable>
  );
}

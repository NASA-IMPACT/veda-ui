import React from 'react';
import { Link } from 'react-router-dom';
import { DatasetData } from 'veda';
import {
  DropMenu,
  Dropdown,
  DropMenuItem,
  DropTitle
} from '@devseed-ui/dropdown';
import {
  CollecticonCompass,
  CollecticonEllipsisVertical,
  CollecticonPage
} from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';

import { getDatasetPath, getDatasetExplorePath } from '$utils/routes';

interface DatasetMenuProps {
  dataset: DatasetData;
}

function DatasetMenu(props: DatasetMenuProps) {
  const { dataset } = props;

  return (
    <Dropdown
      alignment='right'
      direction='up'
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      triggerElement={({ className, ...rest }) => (
        <Button
          // @ts-expect-error achromic-text exists. The problem is bad typing in the UI library.
          variation='achromic-text'
          fitting='skinny'
          size='small'
          {...rest}
        >
          <CollecticonEllipsisVertical />
        </Button>
      )}
    >
      <DropTitle>Options</DropTitle>
      <DropMenu>
        <li>
          <DropMenuItem
            as={Link}
            data-dropdown='click.close'
            to={getDatasetPath(dataset)}
          >
            <CollecticonPage /> Learn more
          </DropMenuItem>
        </li>
        <li>
          <DropMenuItem
            as={Link}
            data-dropdown='click.close'
            to={getDatasetExplorePath(dataset)}
          >
            <CollecticonCompass /> Explore data
          </DropMenuItem>
        </li>
      </DropMenu>
    </Dropdown>
  );
}

export default DatasetMenu;

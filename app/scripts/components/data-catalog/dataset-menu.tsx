import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { visuallyDisabled } from '@devseed-ui/theme-provider';
import { Link } from 'react-router-dom';
import { DatasetData } from 'veda';
import {
  DropMenu,
  Dropdown,
  DropMenuItem,
  DropTitle
} from '@devseed-ui/dropdown';
import {
  CollecticonCode,
  CollecticonCompass,
  CollecticonEllipsisVertical,
  CollecticonPage
} from '@devseed-ui/collecticons';
import { Button } from '@devseed-ui/button';

import { getDatasetPath, getDatasetExplorePath } from '$utils/routes';
import { NotebookConnectModal } from '$components/common/notebook-connect';
import DropMenuItemButton from '$styles/drop-menu-item-button';
import { Tip } from '$components/common/tip';

const DropMenuItemButtonDisable = styled(DropMenuItemButton)<{
  visuallyDisabled: boolean;
}>`
  ${({ visuallyDisabled: v }) => v && visuallyDisabled()}
`;

interface DatasetMenuProps {
  dataset: DatasetData;
}

function DatasetMenu(props: DatasetMenuProps) {
  const { dataset } = props;

  const [revealed, setRevealed] = useState(false);
  const close = useCallback(() => setRevealed(false), []);

  const hasUsage = !!dataset.usage?.length;

  return (
    <>
      <NotebookConnectModal
        dataset={dataset}
        revealed={revealed}
        onClose={close}
      />
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
          <li>
            <Tip
              content='This dataset has no usage information'
              disabled={hasUsage}
            >
              <DropMenuItemButtonDisable
                onClick={() => setRevealed(true)}
                visuallyDisabled={!hasUsage}
              >
                <CollecticonCode />
                Analyze data (Python)
              </DropMenuItemButtonDisable>
            </Tip>
          </li>
        </DropMenu>
      </Dropdown>
    </>
  );
}

export default DatasetMenu;

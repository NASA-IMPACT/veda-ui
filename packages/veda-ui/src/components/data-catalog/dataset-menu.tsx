import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { visuallyDisabled } from '@devseed-ui/theme-provider';
import { Link } from 'react-router-dom';
import {
  DropMenu,
  Dropdown,
  DropMenuItem,
  DropTitle
} from '@devseed-ui/dropdown';
import { Icon } from '@trussworks/react-uswds';
import { DatasetData } from '$types/veda';

import { getDatasetPath, getDatasetExplorePath } from '$utils/routes';
import { NotebookConnectModal } from '$components/common/notebook-connect';
import DropMenuItemButton from '$styles/drop-menu-item-button';
import { Tip } from '$components/common/tip';
import { USWDSButton } from '$uswds';

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
        triggerElement={({ className, onClick, ref, ...rest }) => (
          <div ref={ref}>
            <USWDSButton
              type='button'
              unstyled
              onClick={onClick}
              className={className}
              {...rest}
            >
              <Icon.MoreVert size={3} color='white' />
            </USWDSButton>
          </div>
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
              <Icon.ContactPage size={3} /> Learn more
            </DropMenuItem>
          </li>
          <li>
            <DropMenuItem
              as={Link}
              data-dropdown='click.close'
              to={getDatasetExplorePath(dataset)}
            >
              <Icon.NearMe size={3} /> Explore data
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
                <Icon.Code size={3} />
                Access data
              </DropMenuItemButtonDisable>
            </Tip>
          </li>
        </DropMenu>
      </Dropdown>
    </>
  );
}

export default DatasetMenu;

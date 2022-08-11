import React from 'react';
import styled from 'styled-components';
import { CollecticonGlobe } from '@devseed-ui/collecticons';
import { Dropdown, DropMenu, DropTitle } from '@devseed-ui/dropdown';
import { Button, createButtonStyles } from '@devseed-ui/button';
import { glsp, themeVal } from '@devseed-ui/theme-provider';
import { ShadowScrollbar } from '@devseed-ui/shadow-scrollbar';

import {
  ProjectionItemConic,
  ProjectionItemCustom,
  ProjectionItemSimple
} from './projection-selector-items';
import { ProjectionSelectorProps } from './projection-selector.types';
import { projectionsList } from './projection-selector-utils';

const DropHeader = styled.div`
  padding: ${glsp()};
  box-shadow: inset 0 -1px 0 0 ${themeVal('color.base-100a')};
`;

const DropBody = styled.div`
  padding: ${glsp(0, 0, 1, 0)};
`;

/**
 * Override Dropdown styles to play well with the shadow scrollbar.
 */
const DropdownWithScroll = styled(Dropdown)`
  padding: 0;

  ${DropTitle} {
    margin: 0;
  }

  ${DropMenu} {
    margin: 0;
  }
`;

// Why you ask? Very well:
// Mapbox's css has an instruction that sets the hover color for buttons to
// near black. The only way to override it is to increase the specificity and
// we need the button functions to get the correct color.
// The infamous instruction:
// .mapboxgl-ctrl button:not(:disabled):hover {
//   background-color: rgba(0, 0, 0, 0.05);
// }
const SelectorButton = styled(Button)`
  &&& {
    ${createButtonStyles({ variation: 'primary-fill', fitting: 'skinny' })}
  }
`;

const shadowScrollbarProps = {
  autoHeight: true,
  autoHeightMax: 320
};

function ProjectionSelector(props: ProjectionSelectorProps) {
  const { projection, onChange } = props;

  return (
    <DropdownWithScroll
      triggerElement={(bag) => (
        <SelectorButton {...bag}>
          <CollecticonGlobe meaningful title='Select projection to use' />
        </SelectorButton>
      )}
      direction='down'
      alignment='left'
    >
      <DropHeader>
        <DropTitle>Map projections</DropTitle>
      </DropHeader>
      <DropBody>
        <ShadowScrollbar scrollbarsProps={shadowScrollbarProps}>
          <DropMenu>
            {projectionsList.map((proj) => {
              if (proj.isCustom && proj.conicValues) {
                return (
                  <ProjectionItemCustom
                    key={proj.id}
                    onChange={onChange}
                    id={proj.id}
                    label={proj.label}
                    defaultConicValues={proj.conicValues}
                    activeProjection={projection}
                  />
                );
              } else if (proj.conicValues) {
                return (
                  <ProjectionItemConic
                    key={proj.id}
                    onChange={onChange}
                    id={proj.id}
                    label={proj.label}
                    defaultConicValues={proj.conicValues}
                    activeProjection={projection}
                  />
                );
              } else {
                return (
                  <ProjectionItemSimple
                    key={proj.id}
                    onChange={onChange}
                    id={proj.id}
                    label={proj.label}
                    activeProjection={projection}
                  />
                );
              }
            })}
          </DropMenu>
        </ShadowScrollbar>
      </DropBody>
    </DropdownWithScroll>
  );
}

export default ProjectionSelector;

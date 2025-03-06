import React from 'react';
import styled, { useTheme } from 'styled-components';
import { listReset, themeVal } from '@devseed-ui/theme-provider';

import { Fold } from '$components/common/fold';

const ColorsGrid = styled.ul`
  ${listReset()};
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem 1rem;
  grid-column: 1/-1;
`;

const Color = styled.li`
  display: flex;
  flex-flow: column;
  align-items: center;
`;

const ColorSquare = styled.div`
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  border: 1px dashed #333;
  border-radius: ${themeVal('shape.rounded')};
  background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAAAAACoWZBhAAAAF0lEQVQI12P4BAI/QICBFCaYBPNJYQIAkUZftTbC4sIAAAAASUVORK5CYII=');

  .spot {
    width: 100%;
    height: 100%;
    background: ${({ color }) => color};
  }
`;

function SandboxColors() {
  const theme = useTheme();

  return (
    <Fold>
      <ColorsGrid>
        {Object.keys(theme.color).map((key) => (
          <Color key={key}>
            <ColorSquare color={theme.color[key]}>
              <div className='spot' />
            </ColorSquare>
            <strong>color.{key}</strong>
            <p>{theme.color[key]}</p>
          </Color>
        ))}
      </ColorsGrid>
    </Fold>
  );
}

export default SandboxColors;

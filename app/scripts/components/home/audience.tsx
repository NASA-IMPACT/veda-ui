import React from 'react';
import styled from 'styled-components';
import { listReset, media, themeVal } from '@devseed-ui/theme-provider';

import imgEnthusiasts from '../../../graphics/layout/user-enthusiasts.jpg';
import imgScientists from '../../../graphics/layout/user-scientists.jpg';
import imgResearcher from '../../../graphics/layout/user-researcher.jpg';

import {
  Fold,
  FoldHeader,
  FoldTitle,
  FoldLead,
  FoldBody
} from '$components/common/fold';
import { Figure } from '$components/common/figure';
import { VarProse } from '$styles/variable-components';
import { variableGlsp } from '$styles/variable-utils';

const BlockAudience = styled.article`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};
  text-align: center;
`;

const BlockAudienceProse = styled(VarProse)`
  /* styled-component */
`;

const BlockAudienceMedia = styled(Figure)`
  order: -1;
  overflow: hidden;
  border-radius: ${themeVal('shape.ellipsoid')};
`;

const AudienceList = styled.ul`
  ${listReset()};
  grid-column: 1 / -1;
  display: grid;
  grid-template-columns: repeat(1, 1fr);
  gap: ${variableGlsp()};

  ${media.smallUp`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${media.largeUp`
    grid-template-columns: repeat(3, 1fr);
  `}

  li {
    padding: ${variableGlsp(0, 2)};
  }
`;

function Audience() {
  return (
    <Fold>
      <FoldHeader>
        <FoldTitle>VEDA serves a wide scientific audience</FoldTitle>
        <FoldLead>
          VEDA makes science based on NASA datasets inclusive, accessible, and
          reproducible.
        </FoldLead>
      </FoldHeader>
      <FoldBody>
        <AudienceList>
          <li>
            <BlockAudience>
              <BlockAudienceProse>
                <h3>Earth scientists</h3>
                <p>
                  Easily access high quality Earth data from NASA and its
                  associated partners.
                </p>
              </BlockAudienceProse>
              <BlockAudienceMedia>
                <img
                  src={imgScientists}
                  alt='United States at night seen from orbit'
                />
              </BlockAudienceMedia>
            </BlockAudience>
          </li>

          <li>
            <BlockAudience>
              <BlockAudienceProse>
                <h3>Academic researchers</h3>
                <p>
                  Support your research efforts with an open source
                  cloud-computing platform backed by NASA data.
                </p>
              </BlockAudienceProse>
              <BlockAudienceMedia>
                <img
                  src={imgResearcher}
                  alt='Philippine woman scientist working at a desk in front of a computer'
                />
              </BlockAudienceMedia>
            </BlockAudience>
          </li>

          <li>
            <BlockAudience>
              <BlockAudienceProse>
                <h3>Science enthusiasts</h3>
                <p>
                  Discover the latest in Earth Observation, how that might impact environmental change,
                  and how this might impact where you live.
                </p>
              </BlockAudienceProse>
              <BlockAudienceMedia>
                <img
                  src={imgEnthusiasts}
                  alt={`An intricate maze of small lakes and waterways define the Yukon Delta at the confluence of Alaska's Yukon and Kuskokwim Rivers with the frigid Bering Sea.`}
                />
              </BlockAudienceMedia>
            </BlockAudience>
          </li>
        </AudienceList>
      </FoldBody>
    </Fold>
  );
}

export default Audience;

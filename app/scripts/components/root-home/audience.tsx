import React from 'react';
import styled from 'styled-components';
import { listReset, media, themeVal } from '@devseed-ui/theme-provider';

import imgEnthusiasts from '../../../graphics/layout/user-enthusiasts.jpg';
import imgScientists from '../../../graphics/layout/user-scientists.jpg';
import imgResearcher from '../../../graphics/layout/user-researcher.jpg';
import imgMaker from '../../../graphics/layout/user-maker.jpg';

import {
  Fold,
  FoldHeader,
  FoldTitle,
  FoldLead,
  FoldBody
} from '$components/common/fold';
import {
  Figure,
  // Figcaption,
  // FigureAttribution
} from '$components/common/figure';
import { VarProse } from '$styles/variable-components';
import { variableGlsp } from '$styles/variable-utils';

const BlockAudience = styled.article`
  display: flex;
  flex-flow: column nowrap;
  gap: ${variableGlsp()};
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
    grid-template-columns: repeat(4, 1fr);
  `}
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
                {/* <Figcaption>
                  <FigureAttribution
                    author='NASA'
                    url='https://unsplash.com/photos/1lfI7wkGWZ4'
                  />
                </Figcaption> */}
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
                {/* <Figcaption>
                  <FigureAttribution
                    author='Brett Andrei Martin'
                    url='https://unsplash.com/photos/a0TrZ9xqSDk'
                  />
                </Figcaption> */}
              </BlockAudienceMedia>
            </BlockAudience>
          </li>

          <li>
            <BlockAudience>
              <BlockAudienceProse>
                <h3>Policy Makers</h3>
                <p>
                  Access and analyze data in real-time to inform decision
                  making.
                </p>
              </BlockAudienceProse>
              <BlockAudienceMedia>
                <img
                  src={imgMaker}
                  alt='United States Capitol Dome, Exterior Shot, Daylight'
                />
                {/* <Figcaption>
                  <FigureAttribution
                    author='David Sanchez'
                    url='https://unsplash.com/photos/W_Qj9ycEBjQ'
                  />
                </Figcaption> */}
              </BlockAudienceMedia>
            </BlockAudience>
          </li>

          <li>
            <BlockAudience>
              <BlockAudienceProse>
                <h3>Earth Observation Enthusiasts</h3>
                <p>
                  Discover the latest work in Earth Observation and how that
                  might impact climate change and other important initiatives.
                </p>
              </BlockAudienceProse>
              <BlockAudienceMedia>
                <img
                  src={imgEnthusiasts}
                  alt={`An intricate maze of small lakes and waterways define the Yukon Delta at the confluence of Alaska's Yukon and Kuskokwim Rivers with the frigid Bering Sea.`}
                />
                {/* <Figcaption>
                  <FigureAttribution
                    author='USGS'
                    url='https://unsplash.com/photos/83PSfuiPoEs'
                  />
                </Figcaption> */}
              </BlockAudienceMedia>
            </BlockAudience>
          </li>
        </AudienceList>
      </FoldBody>
    </Fold>
  );
}

export default Audience;

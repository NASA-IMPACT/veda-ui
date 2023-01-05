import React from 'react';
import styled from 'styled-components';

import {
  FoldHeader,
  FoldTitle,
  FoldLead,
  FoldBody,
  FoldGrid
} from '$components/common/fold';
import {
  ContentBlockPFAlpha,
  ContentBlockPFBeta
} from '$components/common/blocks';
import ContentBlockFigure from '$components/common/blocks/figure';
import { ContentBlockProse } from '$styles/content-block';

import imgVP01 from '../../../graphics/layout/vp-01-illu.png';
import imgVP02 from '../../../graphics/layout/vp-02-illu.png';
import imgVP03 from '../../../graphics/layout/vp-03-illu.png';

const ContentBlockProseAlt = styled(ContentBlockProse)`
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    &:first-child::before {
      display: none;
    }
  }
`;

const FoldValueProposition = styled(FoldGrid)`
  ${FoldHeader} {
    grid-column: content-start / content-end;
  }
`;

function ValueProposition() {
  return (
    <FoldValueProposition>
      <FoldHeader>
        <FoldTitle>
          A scalable and interactive system for science data
        </FoldTitle>
        <FoldLead>
          VEDA stands for Visualization, Exploration, and Data Analysis.
        </FoldLead>
      </FoldHeader>
      <FoldBody>
        <ContentBlockPFBeta>
          <ContentBlockProseAlt>
            <h3>Comprehensive, open-source Earth Science data catalog</h3>
            <p>
              Explore a wide range of Earth Observation datasets from NASA and
              other sources.
            </p>
          </ContentBlockProseAlt>
          <ContentBlockFigure>
            <img src={imgVP01} alt='Screenshot of VEDA in action.' />
          </ContentBlockFigure>
        </ContentBlockPFBeta>

        <ContentBlockPFAlpha>
          <ContentBlockFigure>
            <img src={imgVP02} alt='Screenshot of VEDA in action.' />
          </ContentBlockFigure>
          <ContentBlockProseAlt>
            <h3>Cloud-enabled scientific analysis</h3>
            <p>
              Perform quick analysis without having to write code or download
              data.
            </p>
          </ContentBlockProseAlt>
        </ContentBlockPFAlpha>

        <ContentBlockPFBeta>
          <ContentBlockProseAlt>
            <h3>Science communication platform</h3>
            <p>
              Share your discoveries with others through the VEDA Dashboard.
              Submit a Feedback form for more information.
            </p>
          </ContentBlockProseAlt>
          <ContentBlockFigure>
            <img src={imgVP03} alt='Screenshot of VEDA in action.' />
          </ContentBlockFigure>
        </ContentBlockPFBeta>
      </FoldBody>
    </FoldValueProposition>
  );
}

export default ValueProposition;

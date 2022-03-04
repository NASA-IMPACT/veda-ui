import React from 'react';
import styled from 'styled-components';

import { media } from '@devseed-ui/theme-provider';

import {
  ContentBlock,
  ContentBlockProse,
  ContentBlockFigure,
  ContentBlockFigcaption
} from '$styles/content-block';

import {
  Figure,
  Figcaption,
  FigcaptionInner,
  FigureAttribution
} from '$components/common/figure';

const ContentBlockPAlpha = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-3 / content-11;
    `}
  }
`;

const ContentBlockPBeta = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.mediumUp`
      column-count: 2;
    `}
  }
`;

const ContentBlockFAlpha = styled(ContentBlock)`
  ${ContentBlockFigure} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-3 / content-11;
    `}
  }
`;

const ContentBlockFBeta = styled(ContentBlock)`
  ${ContentBlockFigure} {
    grid-column: content-start / content-end;
  }
`;

const ContentBlockFGama = styled(ContentBlock)`
  ${ContentBlockFigure} {
    grid-column: full-start / full-end;
  }
`;

const ContentBlockFDelta = styled(ContentBlock)`
  ${ContentBlockFigure} {
    grid-column: full-start / full-end;
  }
`;

const NestedFigure = styled(Figure)`
  float: left;
  width: 50%;
`;

const ContentBlockPFAlpha = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-start / content-7;
    `}
  }

  ${ContentBlockFigure} {
    grid-column: content-start / full-end;
    grid-row: 2;

    ${media.smallUp`
      grid-column: content-2 / full-end;
    `}

    ${media.mediumUp`
      grid-column: content-3 / full-end;
    `}

    ${media.largeUp`
      grid-column: content-7 / full-end;
      grid-row: 1;
    `}

    ${media.xlargeUp`
      grid-column: content-8 / full-end;
    `}
  }
`;

const ContentBlockPFGama = styled(ContentBlock)`
  ${ContentBlockProse} {
    grid-column: content-start / content-end;

    ${media.largeUp`
      grid-column:  content-start / content-7;
    `}
  }

  ${ContentBlockFigure} {
    grid-column: content-start / full-end;
    grid-row: 2;

    ${media.smallUp`
      grid-column: content-2 / full-end;
    `}

    ${media.mediumUp`
      grid-column: content-3 / full-end;
    `}

    ${media.largeUp`
      grid-column: content-7 / full-end;
      grid-row: 1;
    `}

    ${media.xlargeUp`
      grid-column: content-7 / content-end;
    `}
  }
`;

function SandboxContentBlocks() {
  return (
    <>
      <ContentBlockPAlpha>
        <ContentBlockProse>
          <h2>CB Prose Alpha</h2>
          <Figure className='align-left'>
            <img
              alt='Media example'
              src='http://via.placeholder.com/256x128?text=align-left'
              width='256'
              height='80'
            />
            <Figcaption>
              <FigcaptionInner>Lorem ipsum.</FigcaptionInner>{' '}
              <FigureAttribution
                author='Lorem Picsum.'
                url='https://picsum.photos/id/1002/2048/1024'
                forwardedAs='span'
              />
            </Figcaption>
          </Figure>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            vel tristique sapien, non suscipit lacus. Mauris vestibulum bibendum
            sem eget pellentesque. Cras viverra urna felis, non placerat felis
            aliquet at. Mauris aliquam malesuada libero non rutrum. Aenean
            pharetra suscipit nisl id tempus. In eget tellus eros. Mauris
            dignissim odio quis sapien pulvinar, ac varius sapien consectetur.
            Morbi scelerisque ex sit amet est tempor, nec tempus metus
            scelerisque.
          </p>
          <Figure className='align-right'>
            <img
              alt='Media example'
              src='http://via.placeholder.com/256x128?text=align-right'
              width='256'
              height='80'
            />
            <Figcaption>
              <FigcaptionInner>Lorem ipsum.</FigcaptionInner>{' '}
              <FigureAttribution
                author='Lorem Picsum.'
                url='https://picsum.photos/id/1002/2048/1024'
                forwardedAs='span'
              />
            </Figcaption>
          </Figure>
          <p>
            Donec est tellus, finibus lobortis vestibulum tincidunt, egestas id
            nunc. Praesent interdum turpis eu libero iaculis iaculis. Sed tempor
            pulvinar sapien, dapibus commodo orci suscipit ac. Maecenas placerat
            felis vel nisi lobortis, quis blandit mauris accumsan. Donec
            vehicula ipsum orci, sit amet interdum est commodo sed. Duis
            fermentum odio ut condimentum lobortis. Pellentesque pretium quam at
            pulvinar tristique. Class aptent taciti sociosqu ad litora torquent
            per conubia nostra, per inceptos himenaeos.
          </p>
          <Figure className='align-center'>
            <img
              alt='Media example'
              src='http://via.placeholder.com/256x128?text=align-center'
              width='256'
              height='128'
            />
            <Figcaption>
              <FigcaptionInner>Lorem ipsum.</FigcaptionInner>{' '}
              <FigureAttribution
                author='Lorem Picsum.'
                url='https://picsum.photos/id/1002/2048/1024'
                forwardedAs='span'
              />
            </Figcaption>
          </Figure>
          <p>
            Donec est tellus, finibus lobortis vestibulum tincidunt, egestas id
            nunc. Praesent interdum turpis eu libero iaculis iaculis. Sed tempor
            pulvinar sapien, dapibus commodo orci suscipit ac. Maecenas placerat
            felis vel nisi lobortis, quis blandit mauris accumsan. Donec
            vehicula ipsum orci, sit amet interdum est commodo sed. Duis
            fermentum odio ut condimentum lobortis. Pellentesque pretium quam at
            pulvinar tristique. Class aptent taciti sociosqu ad litora torquent
            per conubia nostra, per inceptos himenaeos.
          </p>
        </ContentBlockProse>
      </ContentBlockPAlpha>

      <ContentBlockPBeta>
        <ContentBlockProse>
          <h2>CB Prose Beta</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            vel tristique sapien, non suscipit lacus. Mauris vestibulum bibendum
            sem eget pellentesque. Cras viverra urna felis, non placerat felis
            aliquet at. Mauris aliquam malesuada libero non rutrum.
          </p>
          <p>
            Aenean pharetra suscipit nisl id tempus. In eget tellus eros. Mauris
            dignissim odio quis sapien pulvinar, ac varius sapien consectetur.
            Morbi scelerisque ex sit amet est tempor, nec tempus metus
            scelerisque.
          </p>
          <p>
            Donec est tellus, finibus lobortis vestibulum tincidunt, egestas id
            nunc. Praesent interdum turpis eu libero iaculis iaculis. Sed tempor
            pulvinar sapien, dapibus commodo orci suscipit ac. Maecenas placerat
            felis vel nisi lobortis, quis blandit mauris accumsan. Donec
            vehicula ipsum orci, sit amet interdum est commodo sed.
          </p>
          <h3>Lorem ipsum</h3>
          <p>
            fermentum odio ut condimentum lobortis. Pellentesque pretium quam at
            pulvinar tristique. Class aptent taciti sociosqu ad litora torquent
            per conubia nostra, per inceptos himenaeos.
          </p>
        </ContentBlockProse>
      </ContentBlockPBeta>

      <ContentBlockFAlpha>
        <ContentBlockFigure>
          <img
            src='https://picsum.photos/id/1002/2048/1024'
            alt='Generic placeholder by lorem picsum'
          />
          <Figcaption>
            <FigcaptionInner>Figure A.</FigcaptionInner>{' '}
            <FigureAttribution
              author='Lorem Picsum.'
              url='https://picsum.photos/id/1002/2048/1024'
              forwardedAs='span'
            />
          </Figcaption>
        </ContentBlockFigure>
      </ContentBlockFAlpha>

      <ContentBlockFBeta>
        <ContentBlockFigure>
          <img
            src='https://picsum.photos/id/1002/2048/1024'
            alt='Generic placeholder by lorem picsum'
          />
          <Figcaption>
            <FigcaptionInner>Figure A.</FigcaptionInner>{' '}
            <FigureAttribution
              author='Lorem Picsum.'
              url='https://picsum.photos/id/1002/2048/1024'
              forwardedAs='span'
            />
          </Figcaption>
        </ContentBlockFigure>
      </ContentBlockFBeta>

      <ContentBlockFGama>
        <ContentBlockFigure>
          <img
            src='https://picsum.photos/id/1002/2048/1024'
            alt='Generic placeholder by lorem picsum'
          />
          <Figcaption>
            <FigcaptionInner>Figure A.</FigcaptionInner>{' '}
            <FigureAttribution
              author='Lorem Picsum.'
              url='https://picsum.photos/id/1002/2048/1024'
              forwardedAs='span'
            />
          </Figcaption>
        </ContentBlockFigure>
      </ContentBlockFGama>

      <ContentBlockFDelta>
        <ContentBlockFigure role='group'>
          <NestedFigure role='group'>
            <a href='/'>
              <img
                src='https://picsum.photos/id/1002/2048/1024'
                alt='Generic placeholder by lorem picsum'
              />
            </a>
            <Figcaption>
              <FigureAttribution
                author='Lorem Picsum.'
                url='https://picsum.photos/id/1002/2048/1024'
                forwardedAs='span'
              />
            </Figcaption>
          </NestedFigure>
          <NestedFigure role='group'>
            <a href='/'>
              <img
                src='https://picsum.photos/id/1002/2048/1024'
                alt='Generic placeholder by lorem picsum'
              />
            </a>
            <Figcaption>
              <FigureAttribution
                author='Lorem Picsum.'
                url='https://picsum.photos/id/1002/2048/1024'
                forwardedAs='span'
              />
            </Figcaption>
          </NestedFigure>
          <Figcaption>
            <FigcaptionInner>Figures A and B.</FigcaptionInner>
          </Figcaption>
        </ContentBlockFigure>
      </ContentBlockFDelta>

      <ContentBlockPFAlpha>
        <ContentBlockProse>
          <h2>CB Prose+Figure Alpha</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            vel tristique sapien, non suscipit lacus. Mauris vestibulum bibendum
            sem eget pellentesque. Cras viverra urna felis, non placerat felis
            aliquet at. Mauris aliquam malesuada libero non rutrum.
          </p>
          <p>
            Aenean pharetra suscipit nisl id tempus. In eget tellus eros. Mauris
            dignissim odio quis sapien pulvinar, ac varius sapien consectetur.
            Morbi scelerisque ex sit amet est tempor, nec tempus metus
            scelerisque.
          </p>
          <p>
            Donec est tellus, finibus lobortis vestibulum tincidunt, egestas id
            nunc. Praesent interdum turpis eu libero iaculis iaculis. Sed tempor
            pulvinar sapien, dapibus commodo orci suscipit ac. Maecenas placerat
            felis vel nisi lobortis, quis blandit mauris accumsan. Donec
            vehicula ipsum orci, sit amet interdum est commodo sed. Duis
            fermentum odio ut condimentum lobortis. Pellentesque pretium quam at
            pulvinar tristique. Class aptent taciti sociosqu ad litora torquent
            per conubia nostra, per inceptos himenaeos.
          </p>
        </ContentBlockProse>
        <ContentBlockFigure>
          <img
            src='https://picsum.photos/id/1002/2048/1920'
            alt='Generic placeholder by lorem picsum'
          />
          <Figcaption>
            <FigcaptionInner>Figure A.</FigcaptionInner>{' '}
            <FigureAttribution
              author='Lorem Picsum.'
              url='https://picsum.photos/id/1002/2048/1024'
              forwardedAs='span'
            />
          </Figcaption>
        </ContentBlockFigure>
      </ContentBlockPFAlpha>

      <ContentBlockPFGama>
        <ContentBlockProse>
          <h2>CB Prose+Figure Gama</h2>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum
            vel tristique sapien, non suscipit lacus. Mauris vestibulum bibendum
            sem eget pellentesque. Cras viverra urna felis, non placerat felis
            aliquet at. Mauris aliquam malesuada libero non rutrum.
          </p>
          <p>
            Aenean pharetra suscipit nisl id tempus. In eget tellus eros. Mauris
            dignissim odio quis sapien pulvinar, ac varius sapien consectetur.
            Morbi scelerisque ex sit amet est tempor, nec tempus metus
            scelerisque.
          </p>
          <p>
            Donec est tellus, finibus lobortis vestibulum tincidunt, egestas id
            nunc. Praesent interdum turpis eu libero iaculis iaculis. Sed tempor
            pulvinar sapien, dapibus commodo orci suscipit ac. Maecenas placerat
            felis vel nisi lobortis, quis blandit mauris accumsan. Donec
            vehicula ipsum orci, sit amet interdum est commodo sed. Duis
            fermentum odio ut condimentum lobortis. Pellentesque pretium quam at
            pulvinar tristique. Class aptent taciti sociosqu ad litora torquent
            per conubia nostra, per inceptos himenaeos.
          </p>
        </ContentBlockProse>
        <ContentBlockFigure>
          <img
            src='https://picsum.photos/id/1002/2048/1620'
            alt='Generic placeholder by lorem picsum'
          />
          <Figcaption>
            <FigcaptionInner>Figure A.</FigcaptionInner>{' '}
            <FigureAttribution
              author='Lorem Picsum.'
              url='https://picsum.photos/id/1002/2048/1024'
              forwardedAs='span'
            />
          </Figcaption>
        </ContentBlockFigure>
      </ContentBlockPFGama>
    </>
  );
}

export default SandboxContentBlocks;

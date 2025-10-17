import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';

import {
  Figure,
  FigureAttribution,
  Figcaption,
  FigcaptionInner
} from '$components/common/figure';

const meta: Meta<typeof Figure> = {
  title: 'Library Components/Content Blocks/Figure',
  component: Figure,
  parameters: {
    layout: 'centered',
    withProviders: true,
    docs: {
      description: {
        component:
          'Figure component with attribution overlay. ' +
          'Migrated from CollecticonCircleInformation to USWDS Icon.Info. ' +
          'Hover over the info icon in the top-right to see attribution details.'
      }
    }
  }
};

export default meta;

// Placeholder image from placeholder service
const sampleImageSrc =
  'https://placehold.co/800x600/1e40af/ffffff?text=Earth+Observation+Data';

export const WithAttribution: StoryObj<typeof Figure> = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Figure>
        <img
          src={sampleImageSrc}
          alt='Sample satellite imagery of Earth'
          style={{ width: '100%', height: 'auto' }}
        />
        <FigureAttribution
          author='NASA Earth Observatory'
          url='https://earthobservatory.nasa.gov'
          position='top-right'
        />
        <Figcaption>
          <FigcaptionInner>
            Satellite view showing global cloud patterns and weather systems.
            Hover over the info icon to see attribution.
          </FigcaptionInner>
        </Figcaption>
      </Figure>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Figure with attribution overlay using USWDS Icon.Info. The icon appears in the top-right corner and reveals attribution details on hover.'
      }
    }
  }
};

export const WithAttributionBottomLeft: StoryObj<typeof Figure> = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Figure>
        <img
          src={sampleImageSrc}
          alt='Sample satellite imagery'
          style={{ width: '100%', height: 'auto' }}
        />
        <FigureAttribution
          author='ESA Copernicus'
          url='https://www.esa.int/Applications/Observing_the_Earth/Copernicus'
          position='bottom-left'
        />
      </Figure>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Figure with attribution positioned at bottom-left corner.'
      }
    }
  }
};

export const WithoutAttribution: StoryObj<typeof Figure> = {
  render: () => (
    <div style={{ maxWidth: '600px' }}>
      <Figure>
        <img
          src={sampleImageSrc}
          alt='Sample satellite imagery'
          style={{ width: '100%', height: 'auto' }}
        />
        <Figcaption>
          <FigcaptionInner>
            Figure without attribution - no info icon shown.
          </FigcaptionInner>
        </Figcaption>
      </Figure>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Figure without attribution overlay. When no author prop is provided, the attribution component returns null and no icon is displayed.'
      }
    }
  }
};

export const AllPositions: StoryObj<typeof Figure> = {
  name: 'All Attribution Positions',
  render: () => (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '24px',
        maxWidth: '800px'
      }}
    >
      {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map(
        (position) => (
          <div key={position}>
            <h4 style={{ marginBottom: '8px', textTransform: 'capitalize' }}>
              {position}
            </h4>
            <Figure>
              <img
                src={sampleImageSrc}
                alt={`Attribution at ${position}`}
                style={{ width: '100%', height: 'auto' }}
              />
              <FigureAttribution
                author='NASA'
                url='https://nasa.gov'
                position={position}
              />
            </Figure>
          </div>
        )
      )}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Shows all four attribution position options: top-left, top-right, bottom-left, and bottom-right.'
      }
    }
  }
};

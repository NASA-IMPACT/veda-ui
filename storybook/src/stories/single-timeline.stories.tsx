import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { mockDatasetAnalysisSuccess } from './mock-dataset-analysis-success';
import TimelineSingle from '$components/exploration/components/timeline-single/timeline';
import { useScales } from '$components/exploration/hooks/scales-hooks';

const SingleTimelineExample = () => {
  const { scaled: xScaled, main: xMain } = useScales();
  return (
    <>
      <TimelineSingle
        dataset={mockDatasetAnalysisSuccess}
        selectedDay={new Date('2017-12-01T00:00:00.000Z')}
        setSelectedDay={() => true}
        selectedCompareDay={null}
        setSelectedCompareDay={() => true}
        panelHeight={100}
        selectedInterval={{
          start: new Date('2017-12-01T00:00:00.000Z'),
          end: new Date('2018-12-01T00:00:00.000Z')
        }}
        setSelectedInterval={() => true}
        dataDomain={[
          new Date('2017-12-01T00:00:00.000Z'),
          new Date('2018-12-01T00:00:00.000Z')
        ]}
        setObsolete={() => true}
        scaleFactors={{ k0: 1, k1: 1 }}
        xScaled={xScaled}
        xMain={xMain}
      />
    </>
  );
};

const meta: Meta<typeof SingleTimelineExample> = {
  title: 'Library Components/Map Controls/Single Timeline',
  component: SingleTimelineExample,
  parameters: {
    layout: 'fullscreen',
    withProviders: true
  },
  tags: ['autodocs']
};

export default meta;
type Story = StoryObj<typeof SingleTimelineExample>;

export const Default: Story = {
  render: () => <SingleTimelineExample />
};

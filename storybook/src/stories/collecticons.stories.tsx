import React from 'react';
import { Meta, StoryObj } from '@storybook/react';

import { CollecticonCalendarMinus } from '$components/common/icons-legacy/calendar-minus';
import { CollecticonCalendarPlus } from '$components/common/icons-legacy/calendar-plus';
import { CollecticonDatasetLayers } from '$components/common/icons-legacy/dataset-layers';

export default {
  title: 'Collecticons/Custom Icons',
  component: CollecticonCalendarMinus,
  parameters: {
    withProviders: false
  }
} as Meta;

export const CustomIcons: StoryObj = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '2rem',
        alignItems: 'center',
        fontSize: 32,
        color: 'teal'
      }}
    >
      <CollecticonCalendarMinus />

      <CollecticonCalendarPlus />

      <CollecticonDatasetLayers />
    </div>
  )
};

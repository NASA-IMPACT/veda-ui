import React from 'react';
import { Meta, StoryObj } from '@storybook/react-vite';

import { CollecticonCalendarMinus } from '$components/common/icons-legacy/calendar-minus';
import { CollecticonCalendarPlus } from '$components/common/icons-legacy/calendar-plus';
import { CollecticonDrop } from '$components/common/icons-legacy/drop';

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
        color: 'teal'
      }}
    >
      <CollecticonCalendarMinus width='48' height='48' className='test' />

      <CollecticonCalendarPlus />

      <CollecticonDrop width='12' height='12' />
    </div>
  )
};

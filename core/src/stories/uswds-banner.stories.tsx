import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Banner,
  BannerContent,
  BannerFlag,
  BannerHeader,
  BannerIcon,
  BannerGuidance,
  MediaBlockBody
} from '@trussworks/react-uswds';

const meta: Meta<typeof Banner> = {
  title: 'Components/Banner',
  component: Banner
};

export default meta;
type Story = StoryObj<typeof Banner>;

export const Default: Story = {
  render: () => (
    <Banner>
      <BannerHeader
        isOpen={false}
        flagImg={<BannerFlag />}
        headerText='An official website of the United States government'
        headerActionText="Here's how you know"
      />
      <BannerContent isOpen={false}>
        <BannerFlag />
        <MediaBlockBody>
          <p>An official website of the United States government</p>
          <BannerGuidance>
            <BannerIcon />
            <p>Here&apos;s how you know</p>
          </BannerGuidance>
        </MediaBlockBody>
      </BannerContent>
    </Banner>
  )
};

import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardBody,
  CardGroup,
  CardHeader,
  CardMedia,
  CardFooter
} from '@trussworks/react-uswds';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <h3>Card Title</h3>
      </CardHeader>
      <CardBody>
        <p>
          This is the card body content. It can contain any text or components.
        </p>
      </CardBody>
    </Card>
  )
};

export const WithMedia: Story = {
  render: () => (
    <Card>
      <CardMedia>
        <img
          src='https://via.placeholder.com/300x200/0071bc/ffffff?text=USWDS+Card'
          alt='Placeholder image'
          style={{ width: '100%', height: 'auto' }}
        />
      </CardMedia>
      <CardHeader>
        <h3>Card with Image</h3>
      </CardHeader>
      <CardBody>
        <p>This card includes a media element above the content.</p>
      </CardBody>
    </Card>
  )
};

export const MultipleCards: Story = {
  render: () => (
    <CardGroup>
      <Card>
        <CardHeader>
          <h3>First Card</h3>
        </CardHeader>
        <CardBody>
          <p>This is the first card in a group.</p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h3>Second Card</h3>
        </CardHeader>
        <CardBody>
          <p>This is the second card in a group.</p>
        </CardBody>
      </Card>
      <Card>
        <CardHeader>
          <h3>Third Card</h3>
        </CardHeader>
        <CardBody>
          <p>This is the third card in a group.</p>
        </CardBody>
      </Card>
    </CardGroup>
  )
};

export const WithFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <h3>Card with Footer</h3>
      </CardHeader>
      <CardBody>
        <p>This card has a footer section below the main content.</p>
      </CardBody>
      <CardFooter>
        <button type='button' className='usa-button'>
          Action Button
        </button>
      </CardFooter>
    </Card>
  )
};

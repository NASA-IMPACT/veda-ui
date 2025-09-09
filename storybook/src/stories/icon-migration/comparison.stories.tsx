import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';

import FilterTagLegacy from '$components/common/catalog/catalog-legacy/filter-tag';

const ComparisonContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
`;

const ExampleColumn = styled.div`
  h4 {
    margin: 0 0 1rem 0;
    padding: 0.5rem;
    background: #f9fafb;
    border-radius: 4px;
    font-weight: 600;
    text-align: center;
  }

  .legacy {
    background: #fef3c7;
    color: #92400e;
  }

  .new {
    background: #d1fae5;
    color: #065f46;
  }
`;

// Main story component
const ComponentExamples: React.FC = () => {
  const sampleItem = {
    id: 'air-quality',
    name: 'Air Quality',
    taxonomy: 'topics'
  };

  const handleTagClick = (item: {
    id: string;
    name: string;
    taxonomy: string;
  }) => {
    // eslint-disable-next-line no-console
    console.log('Tag clicked:', item.name);
  };

  return (
    <div style={{ padding: '20px' }}>
      <ComparisonContainer>
        <ExampleColumn>
          <h4 className='legacy'>Before</h4>
          <FilterTagLegacy item={sampleItem} onClick={handleTagClick} />
          <div style={{ marginTop: '8px', fontSize: '12px', color: '#6b7280' }}>
            <code>FilterTagLegacy</code>
          </div>
        </ExampleColumn>

        <ExampleColumn>
          <h4 className='new'>After</h4>
          <div
            style={{
              padding: '16px',
              backgroundColor: '#f9fafb',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            <p style={{ margin: 0, color: '#6b7280' }}>Migration pending</p>
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '12px',
                color: '#9ca3af'
              }}
            >
              Custom close icon to be defined
            </p>
          </div>
        </ExampleColumn>
      </ComparisonContainer>
    </div>
  );
};

const meta: Meta<typeof ComponentExamples> = {
  title: 'Icon Migration/Comparison',
  component: ComponentExamples
};

export default meta;
type Story = StoryObj<typeof ComponentExamples>;

export const Default: Story = {
  render: () => <ComponentExamples />
};

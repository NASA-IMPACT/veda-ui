import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  DatasetLayersIcon,
  CalendarPlusIcon,
  CalendarMinusIcon,
  DropIcon,
  ProgressTickHighIcon,
  ProgressTickMediumIcon,
  ProgressTickLowIcon,
  HandPanIcon,
  HandSwipeHorizontalIcon
} from '$components/common/custom-icon';

// Custom Icons Guidelines Component
const CustomIconsGuidelines: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      <h1>Custom Icons Guidelines</h1>

      <div
        style={{
          border: '1px solid #4ade80',
          padding: '16px',
          marginBottom: '24px',
          backgroundColor: '#f0fdf4',
          borderRadius: '6px'
        }}
      >
        <h3>✅ Current Status</h3>
        <p>
          <strong>VEDA UI uses a hybrid icon system</strong>: USWDS icons for
          standard interface elements and custom icons for VEDA-specific
          functionality. All icons follow consistent patterns and accessibility
          standards.
        </p>
      </div>

      <h2>Custom Icons Overview</h2>
      <p>
        Custom icons are VEDA-specific icons that don&apos;t have USWDS
        equivalents. They follow the same patterns as USWDS icons for
        consistency and are located in{' '}
        <code>$components/common/custom-icon</code>.
      </p>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '16px',
          marginBottom: '24px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <h3>🎯 When to Use Custom Icons</h3>
        <ul>
          <li>
            <strong>VEDA-specific concepts</strong> - Dataset layers,
            uncertainty indicators, water data
          </li>
          <li>
            <strong>No USWDS equivalent exists</strong> - Complex composite
            icons like calendar+plus
          </li>
          <li>
            <strong>Scientific/domain-specific</strong> - Progress indicators,
            data visualization icons
          </li>
        </ul>
      </div>

      <h2>Creating New Custom Icons</h2>
      <p>Follow this pattern when creating new custom icons:</p>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '16px',
          marginBottom: '16px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <pre
          style={{
            background: '#f5f5f5',
            padding: '12px',
            overflow: 'auto',
            margin: '0'
          }}
        >
          <code>
            {`import React from 'react';
import type { IconProps } from '@trussworks/react-uswds/lib/components/Icon/Icon';
import { makeUSWDSIcon } from './utils';

const YourIconComponent = (props: IconProps) => (
  <svg
    viewBox='0 0 24 24'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path d='...' />
  </svg>
);

YourIconComponent.displayName = 'YourIcon';
export const YourIcon = makeUSWDSIcon(YourIconComponent);`}
          </code>
        </pre>
      </div>

      <h3>Requirements</h3>
      <ul>
        <li>
          Use <code>viewBox=&quot;0 0 24 24&quot;</code> and{' '}
          <code>fill=&quot;currentColor&quot;</code>
        </li>
        <li>No hardcoded width/height attributes</li>
        <li>Set displayName for debugging</li>
        <li>
          Wrap with <code>makeUSWDSIcon</code> helper
        </li>
        <li>
          Export from <code>custom-icon/index.tsx</code>
        </li>
      </ul>

      <h2>Usage Guidelines</h2>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          marginBottom: '24px'
        }}
      >
        <div
          style={{
            border: '1px solid #4ade80',
            padding: '16px',
            backgroundColor: '#f0fdf4'
          }}
        >
          <h3>✅ Best Practices</h3>
          <ul>
            <li>
              <strong>Consistent sizing</strong> - Use <code>size={3}</code> by
              default
            </li>
            <li>
              <strong>Accessibility</strong> - Use <code>aria-label</code> for
              meaningful icons
            </li>
            <li>
              <strong>Import pattern</strong> - Import from{' '}
              <code>$components/common/custom-icon</code>
            </li>
            <li>
              <strong>Semantic usage</strong> - Use icons that match their
              context
            </li>
          </ul>
        </div>

        <div
          style={{
            border: '1px solid #f87171',
            padding: '16px',
            backgroundColor: '#fef2f2'
          }}
        >
          <h3>❌ Avoid</h3>
          <ul>
            <li>
              <strong>Arbitrary sizing</strong> - Stick to USWDS size system
            </li>
            <li>
              <strong>Missing accessibility</strong> - Always consider screen
              readers
            </li>
            <li>
              <strong>Inconsistent patterns</strong> - Follow established
              conventions
            </li>
            <li>
              <strong>Over-customization</strong> - Use USWDS icons when
              possible
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Custom Icons Reference Table Component
const CustomIconsReference: React.FC = () => {
  const customIcons = [
    {
      icon: DatasetLayersIcon,
      name: 'DatasetLayersIcon',
      description: 'Dataset layers indicator for data visualization',
      usage: '<DatasetLayersIcon size={3} />',
      category: 'Data Visualization'
    },
    {
      icon: DropIcon,
      name: 'DropIcon',
      description: 'Water/precipitation data indicator',
      usage: '<DropIcon size={3} aria-label="Water data" />',
      category: 'Environmental'
    },
    {
      icon: CalendarPlusIcon,
      name: 'CalendarPlusIcon',
      description: 'Add date to timeline comparison',
      usage: '<CalendarPlusIcon size={3} aria-label="Add date" />',
      category: 'Timeline'
    },
    {
      icon: CalendarMinusIcon,
      name: 'CalendarMinusIcon',
      description: 'Remove date from timeline comparison',
      usage: '<CalendarMinusIcon size={3} aria-label="Remove date" />',
      category: 'Timeline'
    },
    {
      icon: ProgressTickHighIcon,
      name: 'ProgressTickHighIcon',
      description: 'High uncertainty indicator for data quality',
      usage: '<ProgressTickHighIcon size={3} aria-label="High uncertainty" />',
      category: 'Data Quality'
    },
    {
      icon: ProgressTickMediumIcon,
      name: 'ProgressTickMediumIcon',
      description: 'Medium uncertainty indicator for data quality',
      usage:
        '<ProgressTickMediumIcon size={3} aria-label="Medium uncertainty" />',
      category: 'Data Quality'
    },
    {
      icon: ProgressTickLowIcon,
      name: 'ProgressTickLowIcon',
      description: 'Low uncertainty indicator for data quality',
      usage: '<ProgressTickLowIcon size={3} aria-label="Low uncertainty" />',
      category: 'Data Quality'
    },
    {
      icon: HandPanIcon,
      name: 'HandPanIcon',
      description: 'Hand pan gesture for drag/scroll interactions',
      usage: '<HandPanIcon size={3} aria-label="Pan gesture" />',
      category: 'Interaction'
    },
    {
      icon: HandSwipeHorizontalIcon,
      name: 'HandSwipeHorizontalIcon',
      description: 'Hand swipe gesture for horizontal scrolling',
      usage: '<HandSwipeHorizontalIcon size={3} aria-label="Swipe gesture" />',
      category: 'Interaction'
    }
  ];

  return (
    <div style={{ padding: '20px' }}>
      <h1>Custom Icons Reference</h1>
      <p>
        Complete reference of all custom icons available in VEDA UI. These icons
        are VEDA-specific and don&apos;t have USWDS equivalents.
      </p>

      <div style={{ overflow: 'auto', margin: '20px 0' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #e5e7eb',
            borderRadius: '6px',
            overflow: 'hidden',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}
        >
          <thead
            style={{
              backgroundColor: '#f8fafc',
              borderBottom: '2px solid #e5e7eb'
            }}
          >
            <tr>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb',
                  width: '20%',
                  color: '#374151'
                }}
              >
                Icon
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb',
                  width: '25%',
                  color: '#374151'
                }}
              >
                Name
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb',
                  width: '30%',
                  color: '#374151'
                }}
              >
                Description
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderRight: '1px solid #e5e7eb',
                  width: '15%',
                  color: '#374151'
                }}
              >
                Category
              </th>
              <th
                style={{
                  padding: '16px',
                  textAlign: 'left',
                  fontWeight: '600',
                  fontSize: '14px',
                  width: '10%',
                  color: '#374151'
                }}
              >
                Usage
              </th>
            </tr>
          </thead>
          <tbody>
            {customIcons.map((icon, index) => (
              <tr
                key={icon.name}
                style={{
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f9fafb'
                }}
              >
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #f3f4f6',
                    borderRight: '1px solid #e5e7eb',
                    verticalAlign: 'middle'
                  }}
                >
                  <icon.icon size={3} />
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #f3f4f6',
                    borderRight: '1px solid #e5e7eb',
                    verticalAlign: 'middle'
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      color: '#374151',
                      fontWeight: '500'
                    }}
                  >
                    {icon.name}
                  </span>
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #f3f4f6',
                    borderRight: '1px solid #e5e7eb',
                    verticalAlign: 'middle'
                  }}
                >
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>
                    {icon.description}
                  </span>
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #f3f4f6',
                    borderRight: '1px solid #e5e7eb',
                    verticalAlign: 'middle'
                  }}
                >
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#059669',
                      fontWeight: '500',
                      backgroundColor: '#ecfdf5',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}
                  >
                    {icon.category}
                  </span>
                </td>
                <td
                  style={{
                    padding: '16px',
                    borderBottom: '1px solid #f3f4f6',
                    verticalAlign: 'middle'
                  }}
                >
                  <code
                    style={{
                      fontSize: '11px',
                      backgroundColor: '#f3f4f6',
                      padding: '2px 4px',
                      borderRadius: '3px',
                      color: '#374151'
                    }}
                  >
                    {icon.usage}
                  </code>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Guidelines/Custom Icons',
  parameters: {
    docs: {
      description: {
        component:
          'Guidelines and reference for using custom icons in VEDA UI. Includes available custom icons, creation patterns, and best practices for VEDA-specific iconography.'
      }
    }
  }
};

export default meta;

export const Guidelines: StoryObj = {
  render: () => <CustomIconsGuidelines />
};

export const IconReference: StoryObj = {
  render: () => <CustomIconsReference />
};

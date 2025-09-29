import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@trussworks/react-uswds';
import {
  CollecticonMagnifierMinus,
  CollecticonMagnifierPlus
} from '$components/common/icons-legacy';
import { TipButton } from '$components/common/tip-button';

// Example components for migration demo
const LegacyZoomControls: React.FC = () => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    <TipButton
      tipContent='Zoom out'
      fitting='skinny'
      onClick={() => {
        /* zoom out */
      }}
    >
      <CollecticonMagnifierMinus meaningful title='Zoom out' />
    </TipButton>
    <input
      type='range'
      min='0'
      max='100'
      defaultValue='50'
      style={{ width: '100px' }}
    />
    <TipButton
      tipContent='Zoom in'
      fitting='skinny'
      onClick={() => {
        /* zoom in */
      }}
    >
      <CollecticonMagnifierPlus meaningful title='Zoom in' />
    </TipButton>
  </div>
);

const MigratedZoomControls: React.FC = () => (
  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
    <TipButton
      tipContent='Zoom out'
      fitting='skinny'
      onClick={() => {
        /* zoom out */
      }}
    >
      <Icon.ZoomOut size={3} />
    </TipButton>
    <input
      type='range'
      min='0'
      max='100'
      defaultValue='50'
      style={{ width: '100px' }}
    />
    <TipButton
      tipContent='Zoom in'
      fitting='skinny'
      onClick={() => {
        /* zoom in */
      }}
    >
      <Icon.ZoomIn size={3} />
    </TipButton>
  </div>
);

// Migration Examples Component
const MigrationExamplesComponent: React.FC = () => {
  return (
    <div style={{ padding: '20px', maxWidth: '1200px' }}>
      <h1>Collecticons Migration Examples</h1>
      <p>
        Interactive examples showing the migration from collecticons to USWDS
        icons. Compare legacy and migrated components side-by-side to ensure
        visual consistency and proper functionality during the migration
        process.
      </p>

      <div
        style={{
          border: '1px solid #ccc',
          padding: '16px',
          marginBottom: '32px',
          backgroundColor: '#f9f9f9'
        }}
      >
        <h3>🔧 How to Use This Section</h3>
        <ol>
          <li>Copy your existing component and create a migrated version</li>
          <li>
            Replace collecticons with USWDS icons using the Icon Reference table
          </li>
          <li>Add both versions to the comparison grid below</li>
          <li>Test functionality and visual consistency</li>
          <li>Create PR with both versions for team review</li>
        </ol>
      </div>

      {/* Zoom Controls Example */}
      <div style={{ marginBottom: '48px' }}>
        <h2>Zoom Controls Migration</h2>
        <p>
          Migration of interactive zoom controls with range slider and action
          buttons. Demonstrates proper icon sizing and button integration.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '32px',
            margin: '24px 0'
          }}
        >
          <div
            style={{
              padding: '24px',
              border: '2px solid #ef4444',
              borderRadius: '12px',
              backgroundColor: '#fef2f2',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', color: '#991b1b' }}>
              Before (Legacy)
            </h3>
            <div
              style={{
                marginBottom: '16px',
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #fecaca'
              }}
            >
              <LegacyZoomControls />
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#991b1b',
                fontFamily: 'monospace',
                backgroundColor: '#fef2f2',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #fecaca'
              }}
            >
              <strong>Icons:</strong> CollecticonMagnifierPlus,
              CollecticonMagnifierMinus
            </div>
          </div>

          <div
            style={{
              padding: '24px',
              border: '2px solid #22c55e',
              borderRadius: '12px',
              backgroundColor: '#f0fdf4',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 16px 0', color: '#166534' }}>
              After (Migrated)
            </h3>
            <div
              style={{
                marginBottom: '16px',
                padding: '20px',
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                border: '1px solid #bbf7d0'
              }}
            >
              <MigratedZoomControls />
            </div>
            <div
              style={{
                fontSize: '12px',
                color: '#166534',
                fontFamily: 'monospace',
                backgroundColor: '#f0fdf4',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #bbf7d0'
              }}
            >
              <strong>Icons:</strong> Icon.ZoomIn, Icon.ZoomOut
            </div>
          </div>
        </div>
      </div>

      {/* Add Your Component Section */}
      <div style={{ marginBottom: '48px' }}>
        <h2>Add Your Component Comparison</h2>
        <p>
          Copy the grid structure above to compare your before/after components.
          Replace the placeholder content with your actual components.
        </p>

        <div
          style={{
            border: '2px dashed #d1d5db',
            padding: '48px',
            margin: '32px 0',
            textAlign: 'center',
            borderRadius: '12px',
            backgroundColor: '#f9fafb'
          }}
        >
          <div
            style={{ color: '#6b7280', fontSize: '18px', marginBottom: '12px' }}
          >
            📝 Your Component Comparison
          </div>
          <div
            style={{ color: '#9ca3af', fontSize: '16px', marginBottom: '16px' }}
          >
            Copy the grid structure above and replace this placeholder with your
            before/after components
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#6b7280',
              fontFamily: 'monospace',
              backgroundColor: '#f3f4f6',
              padding: '8px 16px',
              borderRadius: '6px',
              display: 'inline-block'
            }}
          >
            &lt;YourLegacyComponent /&gt; → &lt;YourMigratedComponent /&gt;
          </div>
        </div>
      </div>
    </div>
  );
};

const meta: Meta = {
  title: 'Documentation/Migration Examples',
  parameters: {
    docs: {
      description: {
        component:
          'Interactive examples and comparisons for migrating from @devseed-ui/collecticons to USWDS icons. ' +
          'Includes side-by-side comparisons, migration patterns, and component examples to ensure visual consistency.'
      }
    }
  }
};

export default meta;

export const MigrationExamples: StoryObj = {
  render: () => <MigrationExamplesComponent />
};

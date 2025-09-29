import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';
import { ThemeProvider } from 'styled-components';
import { TimelineZoomControls } from '$components/exploration/components/timeline/timeline-zoom-controls';
import { TimelineZoomControlsDeprecated } from '$components/exploration/components/timeline/timeline-zoom-controls.deprecated';

// Styled Components
const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
`;

const InfoBox = styled.div`
  border: 1px solid #ccc;
  padding: 16px;
  margin-bottom: 32px;
  background-color: #f9f9f9;
`;

const ComparisonGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 32px;
  margin: 24px 0;
`;

const ComparisonCard = styled.div<{ variant: 'legacy' | 'migrated' }>`
  padding: 24px;
  border: 2px solid
    ${(props) => (props.variant === 'legacy' ? '#ef4444' : '#22c55e')};
  border-radius: 12px;
  background-color: ${(props) =>
    props.variant === 'legacy' ? '#fef2f2' : '#f0fdf4'};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
`;

const ComparisonTitle = styled.h3<{ variant: 'legacy' | 'migrated' }>`
  margin: 0 0 16px 0;
  color: ${(props) => (props.variant === 'legacy' ? '#991b1b' : '#166534')};
`;

const ComponentPreview = styled.div<{ variant: 'legacy' | 'migrated' }>`
  margin-bottom: 16px;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 8px;
  border: 1px solid
    ${(props) => (props.variant === 'legacy' ? '#fecaca' : '#bbf7d0')};
`;

const IconInfo = styled.div<{ variant: 'legacy' | 'migrated' }>`
  font-size: 12px;
  color: ${(props) => (props.variant === 'legacy' ? '#991b1b' : '#166534')};
  font-family: monospace;
  background-color: ${(props) =>
    props.variant === 'legacy' ? '#fef2f2' : '#f0fdf4'};
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid
    ${(props) => (props.variant === 'legacy' ? '#fecaca' : '#bbf7d0')};
`;

const PlaceholderBox = styled.div`
  border: 2px dashed #d1d5db;
  padding: 48px;
  margin: 32px 0;
  text-align: center;
  border-radius: 12px;
  background-color: #f9fafb;
`;

const PlaceholderTitle = styled.div`
  color: #6b7280;
  font-size: 18px;
  margin-bottom: 12px;
`;

const PlaceholderSubtitle = styled.div`
  color: #9ca3af;
  font-size: 16px;
  margin-bottom: 16px;
`;

const PlaceholderCode = styled.div`
  font-size: 14px;
  color: #6b7280;
  font-family: monospace;
  background-color: #f3f4f6;
  padding: 8px 16px;
  border-radius: 6px;
  display: inline-block;
`;

const SectionWrapper = styled.div`
  margin-bottom: 48px;
`;

// Mock providers for components
const mockTheme = {
  color: {
    'base-400': '#6b7280',
    'base-300': '#d1d5db'
  }
};

/**
 * Generic higher-order component that wraps components with mock providers
 * needed for Storybook rendering (ThemeProvider, etc.)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const withMockProviders = <T extends Record<string, any>>(
  Component: React.ComponentType<T>
) => {
  const WrappedComponent = (props: T) => (
    <ThemeProvider theme={mockTheme}>
      <Component {...props} />
    </ThemeProvider>
  );
  WrappedComponent.displayName = `withMockProviders(${
    Component.displayName || Component.name
  })`;
  return WrappedComponent;
};

/**
 * Helper function to create component comparison pairs for migration examples
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createComponentPair = <T extends Record<string, any>>(
  LegacyComponent: React.ComponentType<T>,
  MigratedComponent: React.ComponentType<T>
) => ({
  Legacy: withMockProviders(LegacyComponent),
  Migrated: withMockProviders(MigratedComponent)
});

// Reusable Components
interface InfoSectionProps {
  title: string;
  children: React.ReactNode;
}

const InfoSection: React.FC<InfoSectionProps> = ({ title, children }) => (
  <InfoBox>
    <h3>{title}</h3>
    {children}
  </InfoBox>
);

interface ComparisonExampleProps {
  title: string;
  description: string;
  legacyComponent: React.ReactNode;
  migratedComponent: React.ReactNode;
  legacyIcons: string;
  migratedIcons: string;
}

const ComparisonExample: React.FC<ComparisonExampleProps> = ({
  title,
  description,
  legacyComponent,
  migratedComponent,
  legacyIcons,
  migratedIcons
}) => (
  <SectionWrapper>
    <h2>{title}</h2>
    <p>{description}</p>
    <ComparisonGrid>
      <ComparisonCard variant='legacy'>
        <ComparisonTitle variant='legacy'>Before (Legacy)</ComparisonTitle>
        <ComponentPreview variant='legacy'>{legacyComponent}</ComponentPreview>
        <IconInfo variant='legacy'>{legacyIcons}</IconInfo>
      </ComparisonCard>
      <ComparisonCard variant='migrated'>
        <ComparisonTitle variant='migrated'>After (Migrated)</ComparisonTitle>
        <ComponentPreview variant='migrated'>
          {migratedComponent}
        </ComponentPreview>
        <IconInfo variant='migrated'>{migratedIcons}</IconInfo>
      </ComparisonCard>
    </ComparisonGrid>
  </SectionWrapper>
);

// Component pairs for migration demo
const ZoomControlsPair = createComponentPair(
  TimelineZoomControlsDeprecated,
  TimelineZoomControls
);

// Migration examples data
interface MigrationExampleData {
  title: string;
  description: string;
  legacyComponent: React.ReactNode;
  migratedComponent: React.ReactNode;
  legacyIcons: string;
  migratedIcons: string;
}

const MIGRATION_EXAMPLES: MigrationExampleData[] = [
  {
    title: 'Zoom Controls Migration',
    description:
      'Migration of interactive zoom controls with range slider and action buttons. Demonstrates proper icon sizing and button integration.',
    legacyComponent: <ZoomControlsPair.Legacy onZoom={() => {}} />,
    migratedComponent: <ZoomControlsPair.Migrated onZoom={() => {}} />,
    legacyIcons:
      'Icons: CollecticonMagnifierPlus, CollecticonMagnifierMinus (from timeline-zoom-controls.deprecated.tsx)',
    migratedIcons:
      'Icons: Icon.ZoomIn, Icon.ZoomOut (from timeline-zoom-controls.tsx)'
  }
  // Add more examples here as needed
];

// Constants
const MIGRATION_STEPS = [
  'Copy your existing component and create a migrated version',
  'Replace collecticons with USWDS icons using the Icon Reference table',
  'Add both versions to the comparison grid below',
  'Test functionality and visual consistency',
  'Create PR with both versions for team review'
];

const PLACEHOLDER_CONTENT = {
  title: '📝 Your Component Comparison',
  subtitle:
    'Copy the grid structure above and replace this placeholder with your before/after components',
  code: '<YourLegacyComponent /> → <YourMigratedComponent />'
};

// Example: To add a new component comparison, use:
// const ButtonGroupPair = createComponentPair(
//   ButtonGroupDeprecated,
//   ButtonGroup
// );
// Then use <ButtonGroupPair.Legacy {...props} /> and <ButtonGroupPair.Migrated {...props} />

// Migration Examples Component
const MigrationExamplesComponent: React.FC = () => {
  return (
    <Container>
      <h1>Collecticons Migration Examples</h1>
      <p>
        Interactive examples showing the migration from collecticons to USWDS
        icons. Compare legacy and migrated components side-by-side to ensure
        visual consistency and proper functionality during the migration
        process.
      </p>

      <InfoSection title='🔧 How to Use This Section'>
        <ol>
          {MIGRATION_STEPS.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </InfoSection>

      {MIGRATION_EXAMPLES.map((example) => (
        <ComparisonExample
          key={example.title}
          title={example.title}
          description={example.description}
          legacyComponent={example.legacyComponent}
          migratedComponent={example.migratedComponent}
          legacyIcons={example.legacyIcons}
          migratedIcons={example.migratedIcons}
        />
      ))}

      {/* Add Your Component Section */}
      <SectionWrapper>
        <h2>Add Your Component Comparison</h2>
        <p>
          Copy the grid structure above to compare your before/after components.
          Replace the placeholder content with your actual components.
        </p>

        <PlaceholderBox>
          <PlaceholderTitle>{PLACEHOLDER_CONTENT.title}</PlaceholderTitle>
          <PlaceholderSubtitle>
            {PLACEHOLDER_CONTENT.subtitle}
          </PlaceholderSubtitle>
          <PlaceholderCode>{PLACEHOLDER_CONTENT.code}</PlaceholderCode>
        </PlaceholderBox>
      </SectionWrapper>
    </Container>
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

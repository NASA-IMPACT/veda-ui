import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from '@trussworks/react-uswds';
import type { IconProps } from '@trussworks/react-uswds/lib/components/Icon/Icon';
import styled from 'styled-components';
import * as CustomIconExports from '$components/common/custom-icon';

const meta: Meta = {
  title: 'Library Components/Icons',
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Complete icon system for VEDA UI. Browse all available USWDS and custom icons with usage examples and guidelines.'
      }
    }
  }
};

export default meta;

const Container = styled.div`
  padding: 2rem;
  max-width: 1200px;
`;

const TableWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 1.5rem 0;
`;

const TableContainer = styled.div`
  overflow: auto;
  max-width: 600px;
  width: 100%;
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #dfe1e2;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
`;

const TableHeader = styled.thead`
  background-color: #f1f1f1;
  border-bottom: 2px solid #dfe1e2;
`;

const TableHeaderCell = styled.th`
  padding: 0.75rem;
  text-align: center;
  font-weight: 600;
  font-size: 0.875rem;
  border-right: 1px solid #dfe1e2;
  width: ${(props: { width?: string }) => props.width || 'auto'};
  color: #1b1b1b;
`;

const TableRow = styled.tr<{ isEven?: boolean }>`
  background-color: ${(props) => (props.isEven ? '#f8f8f8' : '#ffffff')};
`;

const TableCell = styled.td`
  padding: 0.75rem;
  border-bottom: 1px solid #dfe1e2;
  border-right: 1px solid #dfe1e2;
  vertical-align: middle;
  text-align: center;
`;

const IconName = styled.code`
  font-size: 0.75rem;
  color: #1b1b1b;
  font-weight: 500;
`;

const CodeBlock = styled.pre`
  background: #f8f8f8;
  padding: 1rem;
  border-radius: 4px;
  overflow: auto;
  margin: 1rem 0;
`;

const Code = styled.code`
  font-size: 0.875rem;
  color: #1b1b1b;
`;

// Types
interface IconEntry {
  name: string;
  component: React.ComponentType<IconProps> | any;
}

// Pure functions for data processing
const getCustomIcons = (): IconEntry[] => {
  const entries = Object.entries(CustomIconExports)
    .filter(([name, value]) => {
      return (
        name.endsWith('Icon') &&
        typeof value === 'function' &&
        name !== 'makeUSWDSIcon'
      );
    })
    .map(([name, component]) => ({ name, component }));

  return [...entries].sort((a, b) => a.name.localeCompare(b.name));
};

const getUswdsIcons = (): IconEntry[] => {
  const keys = Object.keys(Icon);
  const sorted = [...keys].sort();

  return sorted.map((name) => ({
    name,
    component: Icon[name as keyof typeof Icon]
  }));
};

// Dev-time validation (only runs in development)
const validateCustomIcons = (customIcons: IconEntry[]) => {
  if (process.env.NODE_ENV !== 'development') return;

  const iconFiles = import.meta.glob('$components/common/custom-icon/*.tsx', {
    eager: true
  });
  const fileNames = Object.keys(iconFiles)
    .filter(
      (path) => !path.includes('index.tsx') && !path.includes('utils.tsx')
    )
    .map((path) => {
      const parts = path.split('/');
      const fileName = parts[parts.length - 1]?.replace('.tsx', '') || '';
      return (
        fileName
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join('') + 'Icon'
      );
    });

  const exportedNames = customIcons.map(({ name }) => name);
  const missingExports = fileNames.filter(
    (name) => !exportedNames.includes(name)
  );

  if (missingExports.length > 0) {
    // eslint-disable-next-line no-console
    console.warn(
      `[Icons] Found ${missingExports.length} icon file(s) not exported in custom-icon/index.tsx:`,
      missingExports,
      '\nAdd them to index.tsx to include in documentation.'
    );
  }
};

const IconsReference: React.FC = () => {
  // Memoize expensive operations
  const customIcons = React.useMemo(() => {
    const icons = getCustomIcons();
    validateCustomIcons(icons);
    return icons;
  }, []);

  const uswdsIcons = React.useMemo(() => getUswdsIcons(), []);

  const renderIconTable = (
    title: string,
    description: string,
    icons: IconEntry[]
  ) => (
    <section style={{ marginBottom: '3rem' }}>
      <h2 style={{ marginBottom: '1rem', color: '#1b1b1b' }}>{title}</h2>
      <p style={{ marginBottom: '1.5rem', color: '#565c65' }}>{description}</p>
      <TableWrapper>
        <TableContainer>
          <StyledTable>
            <TableHeader>
              <tr>
                <TableHeaderCell width='25%'>Icon</TableHeaderCell>
                <TableHeaderCell width='75%'>Name</TableHeaderCell>
              </tr>
            </TableHeader>
            <tbody>
              {icons.map(({ name, component: IconComponent }, index) => (
                <TableRow key={name} isEven={index % 2 === 0}>
                  <TableCell>
                    <IconComponent size={3} aria-hidden='true' />
                  </TableCell>
                  <TableCell>
                    <IconName>{name}</IconName>
                  </TableCell>
                </TableRow>
              ))}
            </tbody>
          </StyledTable>
        </TableContainer>
      </TableWrapper>
    </section>
  );

  return (
    <Container>
      <h1>Icons Reference</h1>
      <p style={{ marginBottom: '1.5rem', color: '#565c65' }}>
        Complete catalog of all icons available in VEDA UI. Use{' '}
        <Code>Icon.&#123;name&#125;</Code> for USWDS icons, import custom icons
        from <Code>$components/common/custom-icon</Code>.
      </p>

      {renderIconTable(
        'Custom Icons',
        'Icons not available in USWDS, created for VEDA UI needs.',
        customIcons
      )}

      {renderIconTable(
        'USWDS Icons',
        'Standard interface icons from the US Web Design System.',
        uswdsIcons
      )}
    </Container>
  );
};

const UsageGuidelines: React.FC = () => {
  return (
    <Container>
      <h1>Icon Usage</h1>
      <p style={{ marginBottom: '1.5rem', color: '#565c65' }}>
        VEDA UI uses USWDS icons for standard interface elements and custom
        icons when USWDS doesn&apos;t provide what we need.
      </p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#1b1b1b' }}>
          When to Use Each Type
        </h2>

        <h3>USWDS Icons</h3>
        <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Standard UI elements (close, search, menu, arrows)
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Common actions (add, delete, edit, share)
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Status indicators (check, error, info)
          </li>
        </ul>

        <CodeBlock>
          <Code>
            {`import { Icon } from '@trussworks/react-uswds';

<Icon.Search size={3} aria-label="Search" />
<Icon.Close size={3} aria-label="Close" />`}
          </Code>
        </CodeBlock>

        <h3>Custom Icons</h3>
        <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Icons not available in USWDS (calendar with plus/minus)
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            VEDA-specific needs (dataset layers, data quality indicators)
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Composite or specialized icons (hand gestures, drop icon)
          </li>
        </ul>

        <CodeBlock>
          <Code>
            {`import { DatasetLayersIcon } from '$components/common/custom-icon';

<DatasetLayersIcon size={3} aria-label="Dataset layers" />`}
          </Code>
        </CodeBlock>

        <h2 style={{ marginBottom: '1rem', color: '#1b1b1b' }}>
          Best Practices
        </h2>
        <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            <strong>Consistent sizing:</strong> Use{' '}
            <Code>size=&#123;3&#125;</Code> by default
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            <strong>Accessibility:</strong> Add <Code>aria-label</Code> for
            meaningful icons, <Code>aria-hidden</Code> for decorative ones
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            <strong>Semantic usage:</strong> Choose icons that match their
            context
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            <strong>Prefer USWDS:</strong> Use USWDS icons when available before
            creating custom ones
          </li>
        </ul>
      </section>
    </Container>
  );
};

const CreatingCustomIcons: React.FC = () => {
  return (
    <Container>
      <h1>Creating Custom Icons</h1>
      <p style={{ marginBottom: '1.5rem', color: '#565c65' }}>
        When USWDS doesn&apos;t provide the icon you need, create a custom icon
        following this pattern:
      </p>

      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ marginBottom: '1rem', color: '#1b1b1b' }}>
          Icon Template
        </h2>
        <CodeBlock>
          <Code>
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
          </Code>
        </CodeBlock>

        <h2 style={{ marginBottom: '1rem', color: '#1b1b1b' }}>Requirements</h2>
        <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Use <Code>viewBox=&quot;0 0 24 24&quot;</Code> and{' '}
            <Code>fill=&quot;currentColor&quot;</Code>
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            No hardcoded width/height attributes
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Set displayName for debugging
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Wrap with <Code>makeUSWDSIcon</Code> helper
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Export from <Code>custom-icon/index.tsx</Code>
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Save file as <Code>kebab-case.tsx</Code> in{' '}
            <Code>custom-icon/</Code> directory
          </li>
        </ul>

        <h2 style={{ marginBottom: '1rem', color: '#1b1b1b' }}>Steps</h2>
        <ul style={{ margin: '1rem 0', paddingLeft: '1.5rem' }}>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Create icon file in{' '}
            <Code>app/scripts/components/common/custom-icon/</Code>
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Follow the template above with your SVG path from design tool
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Export from <Code>custom-icon/index.tsx</Code>
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Test icon appearance at different sizes
          </li>
          <li
            style={{
              marginBottom: '0.5rem',
              color: '#565c65'
            }}
          >
            Verify accessibility with screen readers
          </li>
        </ul>
      </section>
    </Container>
  );
};

// Stories
export const Reference: StoryObj = {
  render: () => <IconsReference />,
  parameters: {
    docs: {
      description: {
        story: 'Browse all USWDS and custom icons available in VEDA UI.'
      }
    }
  }
};

export const Usage: StoryObj = {
  render: () => <UsageGuidelines />,
  parameters: {
    docs: {
      description: {
        story: 'Best practices for using icons in your components.'
      }
    }
  }
};

export const Creating: StoryObj = {
  render: () => <CreatingCustomIcons />,
  parameters: {
    docs: {
      description: {
        story: 'Guide for developers creating new custom icons.'
      }
    }
  }
};

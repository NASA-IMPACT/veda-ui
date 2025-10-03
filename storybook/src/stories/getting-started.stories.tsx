import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';
import { themeVal } from '@devseed-ui/theme-provider';

const Container = styled.div`
  padding: 40px;
  max-width: 800px;
  line-height: 1.6;

  h1 {
    margin-bottom: 16px;
    color: ${themeVal('color.base')};
  }

  h2 {
    margin-top: 32px;
    margin-bottom: 16px;
    color: ${themeVal('color.base')};
  }

  p {
    color: ${themeVal('color.base')};
  }

  ul {
    margin-left: 20px;
    color: ${themeVal('color.base')};
  }

  a {
    color: ${themeVal('color.link')};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const Banner = styled.div`
  background-color: ${themeVal('color.warning-50')};
  border: 1px solid ${themeVal('color.warning-200')};
  border-radius: ${themeVal('shape.rounded')};
  padding: 16px;
  margin: 24px 0;
  color: ${themeVal('color.base')};
`;

const Section = styled.div`
  margin-bottom: 24px;
`;

const BannerHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;

  span {
    font-size: 18px;
  }
`;

const BannerText = styled.p`
  margin-top: 0;
  margin-bottom: 12px;
  font-size: 14px;
`;

const BannerContent = styled.div`
  font-size: 14px;

  p {
    margin: 0 0 8px 0;
    font-weight: 500;
  }

  ul {
    margin: 0;
    padding-left: 20px;
  }

  li {
    margin-bottom: 4px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  a {
    font-weight: 500;
  }
`;

const GettingStarted: React.FC = () => {
  return (
    <Container>
      <h1>VEDA UI Storybook</h1>

      <p>Component documentation and reference for the VEDA UI library.</p>

      <Banner>
        <BannerHeader>
          <span>🚧</span>
          <strong>Work in Progress</strong>
        </BannerHeader>
        <BannerText>
          This Storybook is actively being built. Many components are still
          undocumented, and some features may be incomplete.
        </BannerText>
        <BannerContent>
          <p>Stay updated:</p>
          <ul>
            <li>
              Track progress in the{' '}
              <a
                href='https://github.com/NASA-IMPACT/veda-ui/issues/1370'
                target='_blank'
                rel='noopener noreferrer'
              >
                Documentation epic
              </a>
            </li>
            <li>
              Browse{' '}
              <a
                href='https://github.com/NASA-IMPACT/veda-ui/issues?q=is%3Aissue+is%3Aopen+label%3Adocumentation'
                target='_blank'
                rel='noopener noreferrer'
              >
                documentation tickets
              </a>
            </li>
            <li>
              Report issues or suggest improvements via{' '}
              <a
                href='https://github.com/NASA-IMPACT/veda-ui/issues/new'
                target='_blank'
                rel='noopener noreferrer'
              >
                GitHub issues
              </a>{' '}
              using the <b>documentation</b> label
            </li>
          </ul>
        </BannerContent>
      </Banner>

      <Section>
        <h2>What&apos;s Here</h2>

        <p>
          <strong>Library Components</strong> - Reusable components organized by
          feature domain (Catalog, Data Layers, Map Controls)
        </p>

        <p>
          <strong>Examples</strong> - Integration examples showing components in
          use
        </p>

        <p>
          <strong>Guidelines</strong> - Icon usage and migration instructions
        </p>
      </Section>

      <Section>
        <h2>Resources</h2>
        <ul>
          <li>
            <a
              href='https://github.com/NASA-IMPACT/veda-ui'
              target='_blank'
              rel='noopener noreferrer'
            >
              Repository
            </a>
          </li>
        </ul>
      </Section>
    </Container>
  );
};

const meta: Meta = {
  title: 'Getting Started',
  parameters: {
    layout: 'fullscreen'
  }
};

export default meta;

export const Welcome: StoryObj = {
  render: () => <GettingStarted />
};

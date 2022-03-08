import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import styled from 'styled-components';
import { glsp, themeVal } from '@devseed-ui/theme-provider';

import { LayoutProps } from '$components/common/layout-root';
import PageHero from '$components/common/page-hero';
import { FoldProse } from '$components/common/fold';
import { resourceNotFound } from '$components/uhoh';
import PageLocalNav from '$components/common/page-local-nav';
import { PageMainContent } from '$styles/page';

import { variableGlsp, variableProseVSpace } from '$styles/variable-utils';
import { VarProse } from '$styles/variable-components';

import {
  useMdxPageLoader,
  useThematicArea,
  useThematicAreaDiscovery
} from '$utils/thematics';

import { thematicDiscoveriesPath } from '$utils/routes';
import Chart from '$components/discoveries/chart/';

export const ContentBlockProse = styled(VarProse)`
  font-size: 1rem;
  gap: ${variableGlsp()};
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    &:first-child {
      column-span: all;
      max-width: 52rem;
      display: flex;
      flex-direction: column;
      gap: calc(${glsp()} - ${glsp(0.25)});
      margin-bottom: ${variableProseVSpace()};
      &::before {
        content: '';
        width: ${glsp(2)};
        height: ${glsp(0.25)};
        border-radius: ${themeVal('shape.rounded')};
        background: ${themeVal('color.primary')};
      }
    }
  }
  *:not(p) {
    break-inside: avoid;
  }

  [class*='align-'] {
    figcaption {
      padding: 0;
    }
  }
  .align-left {
    float: left;
    margin-right: ${variableProseVSpace()};
  }
  .align-right {
    float: right;
    margin-left: ${variableProseVSpace()};
  }
  .align-center {
    margin-left: 50%;
    transform: translate(-50%, 0);
  }
  p {
    background-color: transparent;
  }
`;

const ExperimentP = styled.p`
  background-color: red;
`;

function DiscoveriesSingle() {
  const thematic = useThematicArea();
  const discovery = useThematicAreaDiscovery();
  const pageMdx = useMdxPageLoader(discovery?.content);

  if (!thematic || !discovery) throw resourceNotFound();

  const { media } = discovery.data;

  return (
    <>
      <LayoutProps title={discovery.data.name} />
      <PageLocalNav
        parentName='Discovery'
        parentLabel='Discoveries'
        parentTo={thematicDiscoveriesPath(thematic)}
        items={thematic.data.discoveries}
        currentId={discovery.data.id}
      />
      <PageMainContent>
        <PageHero
          title={discovery.data.name}
          description={discovery.data.description}
          publishedDate={discovery.data.pubDate}
          coverSrc={media?.src}
          coverAlt={media?.alt}
          attributionAuthor={media?.author?.name}
          attributionUrl={media?.author?.url}
        />
        <FoldProse>
          {pageMdx.status === 'loading' && <p>Loading page content</p>}
          {pageMdx.status === 'success' && (
            <MDXProvider
              components={{
                h2: (props) => <h2 {...props} className='test-class' />,
                p: ExperimentP,
                img: (props) => {
                  if (props.type == 'full') return <img {...props} />;
                  return <p> not full </p>;
                },
                Block: (props) => {
                  if (props.children.length)
                    props.children.map((e) => {
                      // native component
                      if (typeof e.type == 'object') console.log(e.type.target);
                      // any customized component
                      else console.log(e.type.name);
                    });

                  return <ContentBlockProse {...props} />;
                },
                Chart
              }}
            >
              <pageMdx.MdxContent />
            </MDXProvider>
          )}
        </FoldProse>
      </PageMainContent>
    </>
  );
}

export default DiscoveriesSingle;

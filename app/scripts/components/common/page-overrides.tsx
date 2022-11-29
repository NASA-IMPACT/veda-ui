import React, { lazy } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { getOverride, PageOverrides } from 'veda/thematics';

import { useMdxPageLoader } from '$utils/thematics';
import { S_SUCCEEDED } from '$utils/status';

const MdxContent = lazy(() => import('./mdx-content'));

interface ComponentOverrideProps {
  [key: string]: any;
  with: PageOverrides;
  children: React.ReactNode;
}

export function ComponentOverride(props: ComponentOverrideProps) {
  const { with: _with, children, ...rest } = props;
  const loader = getOverride(_with)?.content;
  const pageMdx = useMdxPageLoader(loader);

  if (!loader) {
    return children;
  }

  if (pageMdx.status === S_SUCCEEDED) {
    return (
      <MDXProvider>
        <pageMdx.MdxContent {...rest} />
      </MDXProvider>
    );
  }

  return null;
}

export function ContentOverride(props: ComponentOverrideProps) {
  const loader = getOverride(props.with)?.content;

  return loader ? <MdxContent loader={loader} /> : <>{props.children}</>;
}

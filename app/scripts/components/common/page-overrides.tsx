import React, { lazy, ReactNode } from 'react';
import { MDXProvider } from '@mdx-js/react';
import { getOverride, PageOverrides } from 'veda';

// import { useMdxPageLoader } from '$utils/veda-data';
import { useMdxPageLoader } from '$utils/veda-data/mdx';
import { S_SUCCEEDED } from '$utils/status';

const MdxContent = lazy(() => import('./mdx-content'));

interface ComponentOverrideProps {
  [key: string]: any;
  with: PageOverrides;
  children: ReactNode;
}

export function ComponentOverride(props: ComponentOverrideProps) {
  const { with: _with, children, ...rest } = props;
  const loader = getOverride(_with)?.content;
  const pageMdx = useMdxPageLoader(loader);

  if (!loader) {
    return <>{children}</>;
  }

  if (pageMdx.status === S_SUCCEEDED) {
    return (
      <MDXProvider>
        <pageMdx.MdxContent {...rest} />
      </MDXProvider>
    );
  }

  return <>{false}</>;
}

export function ContentOverride(props: ComponentOverrideProps) {
  const { with: _with, children, ...rest } = props;
  const loader = getOverride(_with)?.content;

  return loader ? (
    <MdxContent loader={loader} throughProps={rest} />
  ) : (
    <>{children}</>
  );
}

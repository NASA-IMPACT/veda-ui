import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { config } from 'delta/thematics';

import { useMdxPageLoader } from '$utils/thematics';
import { S_SUCCEEDED } from '$utils/status';


interface ComponentOverrideProps {
  with: keyof typeof config.pageOverrides;
  children: React.ReactNode;
}

function ComponentOverride(props: ComponentOverrideProps) {
  const loader = config.pageOverrides[props.with]?.content;
  const pageMdx = useMdxPageLoader(loader);

  if (!loader) {
    return props.children;
  }

  if (pageMdx.status === S_SUCCEEDED) {
    return (
      <MDXProvider>
        <pageMdx.MdxContent />
      </MDXProvider>
    );
  }

  return null;
}

export default ComponentOverride;

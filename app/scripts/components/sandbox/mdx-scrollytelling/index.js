import React, { lazy } from 'react';

const MdxContent = lazy(() => import('$components/common/mdx-content'));
const pageLoader = () => import('./page.mdx');

function SandboxMDXScrolly() {
  return <MdxContent loader={pageLoader} />;
}

export default SandboxMDXScrolly;

import React, { lazy } from 'react';

const MdxContent = lazy(() => import('$components/common/mdx-content'));
const pageLoader = () => import('./chart.mdx');

function SandboxMDXPage() {
  return <MdxContent loader={pageLoader} />;
}

export default SandboxMDXPage;

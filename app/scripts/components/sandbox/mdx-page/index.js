import React from 'react';
import MdxContent from '$components/common/mdx-content';

const pageLoader = () => import('./page.mdx');

function SandboxMDXPage() {
  return <MdxContent loader={pageLoader} />;
}

export default SandboxMDXPage;

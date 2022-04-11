import React from 'react';
import MdxContent from '$components/common/mdx-content';

const pageLoader = () => import('./page.mdx');

function SandboxMDXScrolly() {
  return <MdxContent loader={pageLoader} />;
}

export default SandboxMDXScrolly;

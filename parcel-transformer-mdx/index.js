const { Transformer } = require('@parcel/plugin');

module.exports = new Transformer({
  async transform({ asset }) {
    // Using dynamic imports to work around Parcel package manager
    const { compile } = await import('@mdx-js/mdx');
    const { default: remarkGfm } = await import('remark-gfm');

    let code = await asset.getCode();
    let compiled = await compile(code, {
      providerImportSource: '@mdx-js/react',
      remarkPlugins: [remarkGfm]
    });
    asset.type = 'js';
    asset.setCode(`/* @jsxRuntime classic */
    /* @jsx mdx */
    import React from 'react';
    import { mdx } from '@mdx-js/react'
    ${compiled}
    `);

    return [asset];
  }
});

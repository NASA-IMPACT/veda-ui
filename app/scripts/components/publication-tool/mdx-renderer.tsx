import React from 'react';
import { MDXProvider } from '@mdx-js/react';
import { MDXContent } from 'mdx/types';
import { MDXBlockWithError } from './block-with-error';
import ContentBlockFigure from '$components/common/blocks/figure';
import { ContentBlockProse } from '$styles/content-block';
import Image, { Caption } from '$components/common/blocks/images';
import { Chapter } from '$components/common/blocks/scrollytelling/chapter';
import { NotebookConnectCalloutBlock } from '$components/common/notebook-connect';
import {
  LazyMap,
  LazyScrollyTelling,
  LazyChart,
  LazyCompareImage
} from '$components/common/blocks/lazy-components';
import SmartLink from '$components/common/smart-link';

const COMPONENTS = {
  Block: MDXBlockWithError,
  Prose: ContentBlockProse,
  Figure: ContentBlockFigure,
  Caption,
  Chapter,
  Image,
  Map: LazyMap,
  ScrollytellingBlock: LazyScrollyTelling,
  Chart: LazyChart,
  CompareImage: LazyCompareImage,
  NotebookConnectCallout: NotebookConnectCalloutBlock,
  Link: SmartLink
};

interface MDXRendererProps {
  result: MDXContent | null;
}

export default function MDXRenderer({ result }: MDXRendererProps) {
  return (
    <MDXProvider components={COMPONENTS}>
      {result && result({ components: COMPONENTS })}
    </MDXProvider>
  );
}

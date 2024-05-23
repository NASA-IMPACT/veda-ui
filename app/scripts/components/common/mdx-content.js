import React from 'react';
import T from 'prop-types';
import { MDXProvider } from '@mdx-js/react';

import { createContext, useContext } from 'react';
import { datasets, stories } from 'veda';
import { useMdxPageLoader } from '$utils/veda-data';
import { S_LOADING, S_SUCCEEDED } from '$utils/status';
import { ContentLoading } from '$components/common/loading-skeleton';
import Block from '$components/common/blocks';
import ContentBlockFigure from '$components/common/blocks/figure';
import { ContentBlockProse } from '$styles/content-block';
import Image, { Caption } from '$components/common/blocks/images';
import { Chapter } from '$components/common/blocks/scrollytelling/chapter';
import {
  LazyChart,
  LazyCompareImage,
  LazyScrollyTelling,
  LazyMap,
  LazyTable,
  LazyEmbed
} from '$components/common/blocks/lazy-components';
import { NotebookConnectCalloutBlock } from '$components/common/notebook-connect';
import SmartLink, { CustomLink } from '$components/common/smart-link';

const ContentContext = createContext();

export const ContentContextProvider = ({ children, value }) => {
  console.log('provider');
  console.log(value);
  return (
    <ContentContext.Provider value={value}>{children}</ContentContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useContentContext = () => {
  return useContext(ContentContext);
};

function MdxContent(props) {
  const pageMdx = useMdxPageLoader(props.loader);

  if (pageMdx.status === S_LOADING) {
    return <ContentLoading />;
  }

  if (pageMdx.status === S_SUCCEEDED) {
    return (
      // So Not of all the children components will be rendered on client side? Next will selectively render the components? https://medium.com/@sjoerd3000/using-react-context-in-combination-with-server-components-afe6b5c8923c#:~:text=However%2C%20server%20components%20do%20not,be%20preserved%20across%20different%20requests.
      <ContentContextProvider value={{ datasets, stories }}>
        <MDXProvider
          components={{
            Block,
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
            Link: SmartLink,
            a: CustomLink,
            Table: LazyTable,
            Embed: LazyEmbed
          }}
        >
          <pageMdx.MdxContent {...(props.throughProps || {})} />
        </MDXProvider>
      </ContentContextProvider>
    );
  }

  return null;
}

MdxContent.propTypes = {
  loader: T.func,
  throughProps: T.object
};

export default MdxContent;

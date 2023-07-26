import React from 'react';

import MDXEditor from './mdx-editor';
import { PageMainContent } from '$styles/page';
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

const components = {
  h1: (props) => <h1 style={{ color: 'tomato' }} {...props} />,
  Test: () => <div>Test</div>,
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

export const MDX_LOCAL_STORAGE_KEY = 'MDX_EDITOR';
export const MDX_SOURCE_DEFAULT = [
  `<Block>
  <Prose>
    ### Your markdown header

    Your markdown contents comes here.
  </Prose>
</Block>`
,
`<Block>
<Prose>
  ### Hello

  Your markdown contents comes here.
</Prose>
</Block>`
,
  `<Block type='full'>
  <Figure>
    <Map
      datasetId='no2'
      layerId='no2-monthly'
      center={[120.11, 34.95]}
      zoom={4.5}
      dateTime='2020-02-01'
      compareDateTime='2022-02-01'
    />
    <Caption 
      attrAuthor='NASA' 
      attrUrl='https://nasa.gov/'
    >
      Levels in 10¹⁵ molecules cm⁻². Darker colors indicate higher nitrogen dioxide (NO₂) levels associated and more activity. Lighter colors indicate lower levels of NO₂ and less activity.
    </Caption> 
    <Caption 
      attrAuthor='NASA' 
      attrUrl='https://nasa.gov/'
    >
      Levels in 10¹⁵ molecules cm⁻². Darker colors indicate higher nitrogen dioxide (NO₂) levels associated and more activity. Lighter colors indicate lower levels of NO₂ and less activity.
    </Caption> 
  </Figure>
  <Prose>
    ## Seeing Rebounds in NO2
  
    After the initial shock of COVID-related shutdowns in the spring, communities worldwide began to reopen and gradually increase mobility. Cars returned to the road, and travel restrictions slowly eased. These resumptions corresponded with relative increases in nitrogen dioxide levels and other air pollutants, as air quality levels began to return to pre-pandemic levels.
    
    This demonstrates how quickly atmospheric nitrogen dioxide responds to reductions in emissions. They will persist as long as emissions persist and decline rapidly if emissions are reduced.
    
    NASA scientists will continue to monitor nitrogen dioxide levels and long-term trends around the world. NASA is expected to launch its [Tropospheric Emissions: Monitoring of Pollution (TEMPO)](http://tempo.si.edu/overview.html "Explore the TEMPO instrument") instrument in 2022, which will provide hourly, high-resolution measurements of nitrogen dioxide, ozone, and other air pollutants across North America, improving future air quality forecasts.
    
    [Explore How COVID-19 Is Affecting Earth's Climate](/covid19/discoveries/climate/climate-change-and-covid "Explore How COVID-19 Is Affecting Earth's Climate")
  </Prose>
</Block>
`
];

const savedSource = localStorage.getItem(MDX_LOCAL_STORAGE_KEY);

export default function MDXEditorWrapper() {
  return (
    <PageMainContent>
      <article>
        <MDXEditor
          // initialSource={savedSource ?? MDX_SOURCE_DEFAULT}
          initialSource={MDX_SOURCE_DEFAULT}
          components={components}
        />
      </article>
    </PageMainContent>
  );
}

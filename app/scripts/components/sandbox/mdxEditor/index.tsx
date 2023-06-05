import React from 'react';
import MDXEditor from './MDX';
import { PageMainContent } from '$styles/page';
import Block from '$components/common/blocks';
import ContentBlockFigure from '$components/common/blocks/figure';
import { ContentBlockProse } from '$styles/content-block';
import Image, { Caption } from '$components/common/blocks/images';
import { Chapter } from '$components/common/blocks/scrollytelling/chapter';
import {
  LazyMap
} from '$components/common/blocks/lazy-components';

const components = {
  h1: (props) => <h1 style={{ color: "tomato" }} {...props} />,
  Test: () => <div>Test</div>,
  Block,
  Prose: ContentBlockProse,
  Figure: ContentBlockFigure,
  Caption,
  Chapter,
  Image,
  Map: LazyMap,
  // ScrollytellingBlock: LazyScrollyTelling,
  // Chart: LazyChart,
  // CompareImage: LazyCompareImage,
  // NotebookConnectCallout: NotebookConnectCalloutBlock
};


const md = `

~~Strikethrough~~

# Styled Component

## Scoped component:

<Test />

<Block>
  <Prose>
    ### Your markdown header

    Your markdown contents comes here.
  </Prose>
</Block>
<Block type='full'>
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
  </Figure>
  <Prose>
    ## Seeing Rebounds in NO2
  
    After the initial shock of COVID-related shutdowns in the spring, communities worldwide began to reopen and gradually increase mobility. Cars returned to the road, and travel restrictions slowly eased. These resumptions corresponded with relative increases in nitrogen dioxide levels and other air pollutants, as air quality levels began to return to pre-pandemic levels.
    
    This demonstrates how quickly atmospheric nitrogen dioxide responds to reductions in emissions. They will persist as long as emissions persist and decline rapidly if emissions are reduced.
    
    NASA scientists will continue to monitor nitrogen dioxide levels and long-term trends around the world. NASA is expected to launch its [Tropospheric Emissions: Monitoring of Pollution (TEMPO)](http://tempo.si.edu/overview.html "Explore the TEMPO instrument") instrument in 2022, which will provide hourly, high-resolution measurements of nitrogen dioxide, ozone, and other air pollutants across North America, improving future air quality forecasts.
    
    [Explore How COVID-19 Is Affecting Earth's Climate](/covid19/discoveries/climate/climate-change-and-covid "Explore How COVID-19 Is Affecting Earth's Climate")
  </Prose>
</Block>
<Block type='wide'>
  <Prose>
    ### Your markdown header

    Guerrilla marketing big boy pants. Cloud native container based i also believe it's important for every member to be involved and invested in our company and this is one way to do so 4-blocker i called the it department about that ransomware because of the old antivirus, but he said that we were using avast 2021 hit the ground running, hammer out, programmatically. Out of scope we need to build it so that it scales, for radical candor, yet land it in region, and you better eat a reality sandwich before you walk back in that boardroom. Message the initiative. Close the loop increase the pipelines, or high-level. Meeting assassin.

    Driving the initiative forward shelfware highlights , yet please advise soonest, yet marketing computer development html roi feedback team website, or run it up the flag pole. Our competitors are jumping the shark vec, so encourage & support business growth . If you could do that, that would be great. Low engagement prepare yourself to swim with the sharks that ipo will be a game-changer, or moving the goalposts, nor first-order optimal strategies, but price point. Donuts in the break room we should have a meeting to discuss the details of the next meeting, and highlights . Product management breakout fastworks value-added come up with something buzzworthy, and blue sky, but we've got kpis for that, and i'll book a meeting so we can solution this before the sprint is over. Note for the previous submit: the devil should be on the left shoulder. What's the status on the deliverables for eow? run it up the flagpole we have put the apim bol, temporarily so that we can later put the monitors on that ipo will be a game-changer, for teams were able to drive adoption and awareness, yet let's see if we can dovetail these two projects. Blue sky thinking proceduralize start procrastinating 2 hours get to do work while procrastinating open book pretend to read while manager stands and watches silently nobody is looking quick do your web search manager caught you and you are fured, but that is a good problem to have circle back, so you gotta smoke test your hypothesis wiggle room. Please advise soonest. New economy i called the it department about that ransomware because of the old antivirus, but he said that we were using avast 2021 we need a recap by eod, cob or whatever comes first guerrilla marketing, incentivize adoption. Weaponize the data closer to the metal cross functional teams enable out of the box brainstorming. Turn the crank come up with something buzzworthy, yet UX i am dead inside optimize for search, but circle back.
  </Prose>
</Block>
`;


export default function MDXEditorWrapper() {

  return (
    <PageMainContent>
      <article>
        <MDXEditor initialSource={md} components={components} />
      </article>
    </PageMainContent>
  );
}

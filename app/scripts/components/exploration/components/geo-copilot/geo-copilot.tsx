import React, {useState, useRef, useEffect, CSSProperties} from 'react';

import { themeVal, glsp } from '@devseed-ui/theme-provider';

import { GeoCoPilotSystemDialog } from './geo-copilot-system-dialog';
import { GeoCoPilotUserDialog } from './geo-copilot-user-dialog';
import { askGeoCoPilot } from './geo-copilot-interaction';

import { reconcileDatasets } from '$components/exploration/data-utils-no-faux-module';
import { TimelineDataset } from '$components/exploration/types.d.ts';
import { datasetLayers} from '$components/exploration/data-utils';
import useMaps from '$components/common/map/hooks/use-maps';
import { getZoomFromBbox } from '$components/common/map/utils';

import bbox from '@turf/bbox';
import centroid from '@turf/centroid';
import { AllGeoJSON } from '@turf/helpers';


import PulseLoader from "react-spinners/PulseLoader";

import { CollecticonChevronRightTrailSmall, CollecticonArrowLoop, CollecticonXmarkSmall } from '@devseed-ui/collecticons';

import { Button } from '@devseed-ui/button';

import {
  FormInput
} from '@devseed-ui/form';

import styled from 'styled-components';

interface GeoCoPilotModalProps {
  show: boolean;
  close: () => void;
  datasets: TimelineDataset[];
  setDatasets: (datasets: TimelineDataset[]) => void;
  selectedDay: Date | null;
  setSelectedDay: (d: Date | null) => void;
  selectedCompareDay: Date | null;
  setSelectedCompareDay: (d: Date | null) => void;
  map: any;
}

const GeoCoPilotWrapper = styled.div`
  padding-bottom: ${glsp()};
  height: calc(100% - 10px);
  width: 100%;
  background: #f6f7f8;
  position: relative;
`
const GeoCoPilotContent = styled.div`
  width: 100%;
  height: calc(100% - 80px);
  overflow-y: auto;
  flex-direction: column;
  font-size: 12px;
  display: flex;
`
const GeoCoPilotQueryWrapper = styled.div`
  display: flex;
  overflow: hidden;
  width: 95%;
  margin: auto;
  background-color: ${themeVal('color.surface')};

  > button {
    margin-left: -35px;
  }
`

const GeoCoPilotQuery = styled(FormInput)`
  width: 100%;
  &:focus-within {
    border-radius: ${themeVal('shape.rounded')};
    outline-width: 0.25rem;
    outline-color: ${themeVal('color.primary-200a')};
    outline-style: solid;
  }
`

const GeoCoPilotTitleWrapper = styled.div`
  background: white;
  padding: 10px;
  height: 50px;
  box-shadow: 0 2px 4px #b1b1b1;
  margin-bottom: 3px;
  display: flex;
`

const GeoCoPilotTitle = styled.strong`
  color: #2276ad;
  width: 210px;
  margin: auto;
`

const RestartSession = styled(Button)`
  align-self: flex-end;
  background: #2276ad;
  margin: auto;
  color: white;
`

const CloseSession = styled(Button)`
  align-self: flex-end;
`

const override: CSSProperties = {
  display: "block",
  margin: "1em auto 1em 1em",
  borderColor: "red",
};


export function GeoCoPilotComponent({
  close, 
  show, 
  datasets, 
  setDatasets, 
  selectedDay, 
  setSelectedDay, 
  selectedCompareDay, 
  setSelectedCompareDay,
  map
}: {
  close: () => void;
  show: boolean;
  datasets: TimelineDataset[];
  setDatasets: (datasets: TimelineDataset[]) => void;
  selectedDay: Date | null;
  setSelectedDay: (d: Date | null) => void;
  selectedCompareDay: Date | null;
  setSelectedCompareDay: (d: Date | null) => void;
  map: any;
}) {
  const defaultSystemComment = {
    summary: "Welcome to Geo Co-Pilot! I'm here to assist you with identifying datasets with location and date information. Whether you're analyzing time-sensitive trends or working with geospatial data, I've got you covered. Let me know how I can assist you today!",
    dataset_ids: [],
    bbox: {},
    dateRange: {},
    date: new Date(),
    action: '',
    explanation: null,
    query: '',
    contentType: 'system'
  }
  const [conversation, setConversation] = useState<any>([defaultSystemComment]);
  const [query, setQuery] = useState<string>('');
  const phantomElementRef = useRef(null);
  const [loading, setLoading] = useState<boolean>(false);

  const scrollToBottom = () => {
    const phantomElement = phantomElementRef.current;
    phantomElement.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [loading]);
  // hook to setup chat UI
  // hook to process and start load/process/analyze data
  // change behavior of bounding box zoom
  // add upvote/downvote/share link, approaches
  // add reset conversation option
  // add localstorage option for conversation
  // add verification links to the user dialog
  const addSystemResponse = (answer: any, content: any) => {
    answer['contentType'] = 'system';
    const action = answer['action'];
    
    switch(action) {
      case 'load': {
        const newDatasets = reconcileDatasets(answer['dataset_ids'], datasetLayers, datasets);
        setSelectedDay(new Date(answer['date_range']['start_date']));
        setDatasets(newDatasets);
        const geojson = JSON.parse(JSON.stringify(answer.bbox).replace('coordinates:', 'coordinates'))
        // const {simplifiedFeatures} = getAoiAppropriateFeatures(geojson);
        // debugger;
        const bounds = bbox(geojson);
        const center = centroid(geojson as AllGeoJSON).geometry.coordinates;
        map.flyTo({
          center,
          zoom: getZoomFromBbox(bounds)
        });
        break;
        
      } 
      case 'compare': {
        const newDatasets = reconcileDatasets(answer['dataset_ids'], datasetLayers, datasets);
        setSelectedCompareDay(new Date(answer['date_range']['end_date']));
        setDatasets(newDatasets);
        break;
      } 
      case 'analysis':
        console.log('analysis');
      default:
        console.log(action, answer);
    }
    content = [...content, answer]
    setConversation(content);
    setLoading(false);
    //close loading
  }

  const addNewResponse = () => {
    const userContent = {
      explanations: '',
      query: query,
      contentType: 'user'
    }
    const content = [...conversation, userContent];
    setConversation(content);
    setQuery('');
    setLoading(true);
    askGeoCoPilot({question: query, chat_history: [], content: content}, addSystemResponse);
  };

  const clearSession = () => {
    setConversation([defaultSystemComment]);
  }

  return (
    <GeoCoPilotWrapper>
      <GeoCoPilotTitleWrapper>
        <GeoCoPilotTitle>Geo Co-Pilot</GeoCoPilotTitle>
        <RestartSession size={'small'} onClick={clearSession}>
          <CollecticonArrowLoop/> Restart Session
        </RestartSession>
        <CloseSession onClick={close}><CollecticonXmarkSmall /></CloseSession>
      </GeoCoPilotTitleWrapper> 
      <GeoCoPilotContent>
        {conversation.map((convComponent, index) => {
          if(convComponent.contentType == 'user') {
            return <GeoCoPilotUserDialog key={`user-dialog-${index}`}
              {...convComponent}
            />
          }
          else if (convComponent.contentType == 'system') {
            return <GeoCoPilotSystemDialog key={`system-dialog-${index}`}
              {...convComponent}
            />
          }
        })}
        <PulseLoader
          color={'#2276ad'}
          loading={loading}
          cssOverride={override}
          size={5}
          aria-label="Processing..."
          data-testid="loader"
          ref={phantomElementRef}
        />
        <div id='geo-copilot-phantom' ref={phantomElementRef}></div>
      </GeoCoPilotContent>
      <GeoCoPilotQueryWrapper>
        <GeoCoPilotQuery type="text" placeholder="Type your message..." value={query} onChange={(e) => {setQuery(e.target.value)}} onKeyUp={(e) => e.code == 'Enter' ? addNewResponse() : ''}/>
        <Button
          fitting="skinny"
          onClick={addNewResponse}
        >
          <CollecticonChevronRightTrailSmall meaningful style={{'color': '#2276ad'}}/>
        </Button>
      </GeoCoPilotQueryWrapper> 
    </GeoCoPilotWrapper>
  )
}

export function GeoCoPilot(props: GeoCoPilotModalProps) {
  return <GeoCoPilotComponent {...props} />;
}

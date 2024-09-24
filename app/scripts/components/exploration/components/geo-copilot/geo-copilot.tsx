import React, {useState, useRef, useEffect, CSSProperties} from 'react';

import { themeVal, glsp } from '@devseed-ui/theme-provider';

import { GeoCoPilotSystemDialog } from './geo-copilot-system-dialog';
import { GeoCoPilotUserDialog } from './geo-copilot-user-dialog';
import { askGeoCoPilot } from './geo-copilot-interaction';

import { reconcileDatasets } from '$components/exploration/data-utils-no-faux-module';
import { TimelineDataset } from '$components/exploration/types.d.ts';
import { datasetLayers} from '$components/exploration/data-utils';
import { aoiDeleteAllAtom, selectedForEditingAtom } from '$components/common/map/controls/aoi/atoms';
import { useAnalysisController } from '$components/exploration/hooks/use-analysis-data-request';
import { makeFeatureCollection } from '$components/common/aoi/utils';
import { STATIC_MODE } from '$components/common/map/controls/aoi/index';
import useAois from '$components/common/map/controls/hooks/use-aois';

import { useAtom, useSetAtom } from 'jotai';
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
import { TemporalExtent } from '../timeline/timeline-utils';

import {
  selectedIntervalAtom
} from '$components/exploration/atoms/dates';

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
  setStartEndDates: (startEndDates: TemporalExtent) => void;
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
  padding-right: 35px;
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
  map,
  setStartEndDates
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
  setStartEndDates: (startEndDates: TemporalExtent) => void;
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
  const [history, setHistory] = useState<any>([]);

  const [selectedInterval, setSelectedInterval] = useAtom(selectedIntervalAtom);

  const { onUpdate } = useAois();
  const { runAnalysis } = useAnalysisController();

  const scrollToBottom = () => {
    const phantomElement = phantomElementRef.current;
    phantomElement.scrollIntoView({ behavior: "smooth" });
  };

  const loadInMap = (answer: any) => {
    const geojson = JSON.parse(JSON.stringify(answer.bbox).replace('coordinates:', 'coordinates'));
    const bounds = bbox(geojson);
    const center = centroid(geojson as AllGeoJSON).geometry.coordinates;

    map.flyTo({
      center,
      zoom: getZoomFromBbox(bounds)
    });
    return geojson;
  };

  useEffect(() => {
    scrollToBottom();
  }, [loading]);
  // hook to process and start load/process/analyze data
  // add upvote/downvote/share link, approaches
  // add localstorage option for conversation
  // add verification links to the user dialog
  const addSystemResponse = (answer: any, content: any) => {
    answer['contentType'] = 'system';
    const action = answer['action'];
    const startDate = new Date(answer['date_range']['start_date']);
    const endDate = new Date(answer['date_range']['end_date']);
    const newDatasetIds = answer['dataset_ids'].reduce((layerIds, collectionId) => {
      const foundDataset = datasetLayers.find((dataset) => dataset.stacCol == collectionId);
      if (!!foundDataset) {
        layerIds.push(foundDataset.id)
      }
      return layerIds;
    }, []);
    const newDatasets = reconcileDatasets(newDatasetIds, datasetLayers, datasets);
    const mbDraw = map?._drawControl;
    
    mbDraw.deleteAll();

    setDatasets(newDatasets);
    try {
      switch(action) {
        case 'load': {
          loadInMap(answer);
          setSelectedCompareDay(null);
          setSelectedDay(endDate);
          break;
        } 
        case 'compare': {
          loadInMap(answer);
          setSelectedDay(startDate);
          setSelectedCompareDay(endDate);
          break;
        } 
        case 'statistics': {
          const geojson = loadInMap(answer);
          const updatedGeojson = makeFeatureCollection(
            geojson.features.map((f, i) => ({ id: `${new Date().getTime().toString().slice(-4)}${i}`, ...f }))
          )
          if (!mbDraw) return;
  
          setStartEndDates([startDate, endDate]);
          
          setSelectedInterval({
            start: startDate, end: endDate
          });
  
          onUpdate(updatedGeojson);
  
          const pids = mbDraw.add(geojson);
          
          mbDraw.changeMode(STATIC_MODE, {
            featureIds: pids
          });
          runAnalysis(newDatasets);
          break;
        }
        default:
          console.log(action, answer);
      }
    } catch (error) {
      console.log('Error processing', error);
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
    const length = conversation.length;
    // merge user and system in one payload rather than multiple elements
    let chatHistory = conversation.reduce((history, innerContent, index) => {
      let identifier = innerContent.contentType;
      let chatElement = {};
      if(identifier == 'user' && index != (length - 1)) {
        chatElement = { inputs: {question: innerContent.query} };
        history.push(chatElement);
      }
      else {
        const innerLength = history.length - 1;
        if (!!innerContent.action) {
          chatElement = { outputs: {answer: innerContent.summary} };
        }
        else {
          chatElement = { outputs: {answer: ''} };
        }
        history[innerLength] = {...history[innerLength], ...chatElement};
      }
      return history;
    }, []);

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

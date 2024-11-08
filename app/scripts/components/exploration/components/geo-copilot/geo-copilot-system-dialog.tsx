import React, {useEffect, useState} from 'react';
import axios from 'axios';


import { Button } from '@devseed-ui/button';
import {
  CollecticonHandThumbsUp,
  CollecticonHandThumbsDown,
  CollecticonLink,
  CollecticonChevronUpTrailSmall,
  CollecticonChevronDownTrailSmall,
  CollecticonCalendarRange,
  CollecticonMarker,
  CollecticonMap,

} from '@devseed-ui/collecticons';

import centroid from '@turf/centroid';
import { AllGeoJSON, Feature, Polygon } from '@turf/helpers';

import styled from 'styled-components';
import { geolocationUrl } from './geo-copilot-interaction';

const DialogContent = styled.div`
  width: fit-content;
  max-width: 75%;
  min-width: 25%;
  background: white;
  padding: 1em;
  margin: 1em 0 1em 1em;
  margin-right: auto;
  border-radius: 10px;
`;

const DialogInteraction = styled.div`
  font-size: 0.6rem;
  display: flex;
`;

const ButtonContent = styled.span`
  font-size: 0.6rem;
`;

const ShowHideDetail = styled.div`
  margin-left: auto;
`;

const AnswerDetails = styled.div`
  font-size: 0.6rem;
  padding: 2em;
  background: #f6f7f8;
  border-radius: 10px;
`;

const AnswerDetailsIcon = styled.div`
  display: flex;
  align-items: center;

  span {
    margin-left: 4px;
  }
`;

const AnswerDetailsItem = styled.div`
  margin-bottom: 6px;

  p {
    font-size: 0.7rem;
    margin-left: 12px;
  }
`;

export interface GeoCoPilotModalProps {
    summary: string;
    dataset_ids: any;
    bbox: any;
    date_range: any;
    explanation: any;
}

export function GeoCoPilotSystemDialogComponent({summary, dataset_ids, bbox, dateRange, explanation}: {
    summary: string;
    dataset_ids: any;
    bbox: any;
    dateRange: any;
    explanation: any;
}) {
  const [showDetails, setShowDetails] = useState(false);
  const [location, setLocation] = useState("");

  useEffect(() => {
    const fetchGeolocation = async (center) => {
      try {
        const response = await axios.get(geolocationUrl(center, process.env.MAPBOX_TOKEN));
        setLocation(response.data.features[2].place_name);  // assuming 'features' is the array in the API response
      } catch (error) {
        console.error("Reverse geocoding failed.", error);
      }
    };

    if (Object.keys(bbox).length > 0) {
      bbox.features = bbox.features as Feature<Polygon>[];
      const center = centroid(bbox as AllGeoJSON).geometry.coordinates;
      console.log(bbox);
      fetchGeolocation(center);
    }
  }, [bbox]);

  const updateShowDetails = () => {
    setShowDetails(!showDetails);
  };

  const copyURL = () => {
    navigator.clipboard.writeText(document.URL);
  };

  return (
    <DialogContent>
      <div>{summary}</div>
      {/*Content*/}
      {explanation &&
        <DialogInteraction>
          <div>
            <Button size='small'>
              <CollecticonHandThumbsUp size={10} />
            </Button>
            <Button size='small'>
              <CollecticonHandThumbsDown size={10} />
            </Button>
          </div> |
          {/*Interaction*/}
          <div>
            <Button size='small'>
              <CollecticonLink size={10} />
              <ButtonContent onClick={copyURL}>Copy Map Link</ButtonContent>
            </Button>
          </div>
          {/*Summary*/}
          <ShowHideDetail onClick={updateShowDetails}>
            <Button size='small'>
              {showDetails ?
              <>
                <ButtonContent>Hide Details</ButtonContent>
                <CollecticonChevronUpTrailSmall size={10} />
              </> :
              <>
                <ButtonContent>Show Details</ButtonContent>
                <CollecticonChevronDownTrailSmall size={10} />
              </>}
            </Button>
          </ShowHideDetail>
        </DialogInteraction>}
      {showDetails &&
        <AnswerDetails>
          <AnswerDetailsItem>
            <AnswerDetailsIcon>
              <CollecticonMarker size={10} /><span>Location</span>
            </AnswerDetailsIcon>
            <p>{location}</p>
          </AnswerDetailsItem>
          <AnswerDetailsItem>
            <AnswerDetailsIcon>
              <CollecticonCalendarRange size={10} /><span>Timeframe</span>
            </AnswerDetailsIcon>
            <p>{`${dateRange.start_date} > ${dateRange.end_date}`}</p>
          </AnswerDetailsItem>
          <AnswerDetailsItem>
            <AnswerDetailsIcon>
              <CollecticonMap size={10} /><span>Map layers</span>
            </AnswerDetailsIcon>
            <p>{dataset_ids.join(", ")}</p>
          </AnswerDetailsItem>
        </AnswerDetails>}
    </DialogContent>
  );
}

export function GeoCoPilotSystemDialog(props: GeoCoPilotModalProps) {
    const {summary, dataset_ids, bbox, date_range, explanation} = props;
    return (
      <GeoCoPilotSystemDialogComponent
        summary={summary}
        dataset_ids={dataset_ids}
        bbox={bbox}
        dateRange={date_range}
        explanation={explanation}
      />
    );
}

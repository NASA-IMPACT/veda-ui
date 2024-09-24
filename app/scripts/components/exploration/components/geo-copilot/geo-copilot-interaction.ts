import axios, { AxiosRequestConfig } from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { FeatureCollection, Polygon } from 'geojson';
import { ConcurrencyManagerInstance } from '$components/exploration/concurrency';
import { GeoCoPilotModalProps } from '$components/exploration/components/geo-copilot/geo-copilot-system-dialog';
import { TimelineDataset, TimelineDatasetForUrl } from '$components/exploration/types.d.ts';

import { ExtendedError } from '$components/exploration//data-utils';

import {
  fixAoiFcForStacSearch,
  getFilterPayload
} from '$components/analysis/utils';
import { json } from 'd3';

interface GeoCoPilotInteractionQuery {
  question: string;
  chat_history: any;
  content: any;
}

const GEOCOPILOT_ENDPOINT = 'https://veda-search-poc.azurewebsites.net/score';

/**
 * Gets the asset urls for all datasets in the results of a STAC search given by
 * the input parameters.
 *
 * @param params Dataset search request parameters
 * @param opts Options for the request (see Axios)
 * @returns Promise with the asset urls
 */
export async function askGeoCoPilot(
  {
    question,
    chat_history,
    content
  }: GeoCoPilotInteractionQuery,
  setSystemResponse: (answer: any, content: any) => void
){
  const queryResponse = await axios.post(
    GEOCOPILOT_ENDPOINT,
    {
      'question': question,
      'chat_history': chat_history
    }
  ).then((answer) => {
    setSystemResponse(JSON.parse(answer.data.answer), content);
  }).catch((e) => {
    console.log(e);
    setSystemResponse({
      "dataset_ids": [],
      "summary": "An unidentified error occured. Please try again later.",
      "date_range": {'start_date': '', 'end_date': ''},
      "bbox":{},
      "action": "error",
      "explanation":
      {
          "validation": "",
          "verification":[]
      },
      "query": question
    }, content);
  });
};

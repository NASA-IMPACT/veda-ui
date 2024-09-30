import axios from 'axios';

interface GeoCoPilotInteractionQuery {
  question: string;
  chat_history: any;
  content: any;
}

const GEOCOPILOT_ENDPOINT = process.env.GEO_COPILOT_ENDPOINT;

const ERROR_RESPONSE = {
  "dataset_ids": [],
  "summary": "An unexpected error occurred with this request. Please ask another question.",
  "date_range": {'start_date': '', 'end_date': ''},
  "bbox":{},
  "action": "error",
  "explanation":
  {
      "validation": "",
      "verification":[]
  },
  "query": ''
}

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
  ERROR_RESPONSE['query'] = question

  if (!GEOCOPILOT_ENDPOINT) {
    setSystemResponse(ERROR_RESPONSE, content);
    return;
  }

  await axios.post(
    GEOCOPILOT_ENDPOINT,
    {
      'question': question,
      'chat_history': chat_history
    }
  ).then((answer) => {
    const extractedAnswer = JSON.parse(answer.data.answer);
    content[content.length - 1].explanations = extractedAnswer.explanation.verification;
    setSystemResponse(JSON.parse(answer.data.answer), content);
  }).catch((e) => {
    setSystemResponse(ERROR_RESPONSE, content);
  });
};


// Returns the full geolocation url based on centroid (lat, lon) and mapboxaccesstoken
export const geolocationUrl = (centroid, mapboxAccessToken) =>
  `https://api.mapbox.com/geocoding/v5/mapbox.places/${centroid[0]},${centroid[1]}.json?access_token=${mapboxAccessToken}`;

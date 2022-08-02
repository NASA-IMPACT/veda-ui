const axios = require('axios');
const qs = require('qs');
const request = require('request');

const API_URL = `https://tiles0.planet.com/basemaps/v1/planet-tiles/global_monthly_2016_05_mosaic/gmap/{z}/{x}/{y}.png`;
function _imageEncode(arrayBuffer) {
  let u8 = new Uint8Array(arrayBuffer);
  let b64encoded = btoa(
    [].reduce.call(
      new Uint8Array(arrayBuffer),
      function (p, c) {
        return p + String.fromCharCode(c);
      },
      ''
    )
  );
  let mimetype = 'image/jpeg';
  return 'data:' + mimetype + ';base64,' + b64encoded;
}
export function handler(event, context, callback) {
  console.log(event);
  // apply our function to the queryStringParameters and assign it to a variable
  const API_PARAMS = qs.parse(event.queryStringParameters);
  console.log(API_PARAMS);
  const { z, x, y } = API_PARAMS;

  // // Get env var values defined in our Netlify site UI
  const { PLANET_TOKEN } = process.env;
  // // In this example, the API Key needs to be passed in the params with a key of key.
  // // We're assuming that the ApiParams var will contain the initial ?
  // const URL = `${API_URL}?${API_PARAMS}&key=${API_TOKEN}`;

  // // Let's log some stuff we already have.
  // console.log('Injecting token to', API_URL);
  // console.log('logging event.....', event);
  // console.log('Constructed URL is ...', URL);
  const URL = `https://tiles0.planet.com/basemaps/v1/planet-tiles/global_monthly_2016_05_mosaic/gmap/${z}/${x}/${y}.png?api_key=${PLANET_TOKEN}`;

  // // Here's a function we'll use to define how our response will look like when we call callback
  const pass = (body) => {
    var img = Buffer.from(body, 'base64');
    callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'image/png',
        'Content-Length': img.length
      },
      body: body.toString('base64'),
      isBase64Encoded: true
    });
  };

  // // Perform the API call.
  const get = () => {
    axios
      .get(URL, {
        responseType: 'arraybuffer'
      })
      .then((response) => {
        pass(response.data);
      })
      .catch((err) => pass(err));
  };
  if (event.httpMethod == 'GET') {
    get();
  }
}

import qs from 'qs';
export function formatTitilerParameter(params): string {
  // array<any> parameter except the one comma delimiated (Ex.rescale)
  // https://openveda.cloud/api/raster/docs#/STAC%20Search/tilejson_searches__search_id___tileMatrixSetId__tilejson_json_get
  const {
    bands,
    bidx,
    asset_bidx,
    assets,
    bbox,
    sel,
    sel_method,
    variables,
    ...regularParams
  } = params;

  const repeatParams: Record<string, string[] | undefined> = {
    bands,
    assets,
    bidx,
    asset_bidx,
    sel,
    sel_method,
    variables
  };

  const regularParamsString = qs.stringify(regularParams, {
    arrayFormat: 'comma'
  });

  const repeatParamsString = qs.stringify(repeatParams, {
    arrayFormat: 'repeat'
  });

  const bboxString = bbox ? `bbox=${bbox}` : '';

  return [regularParamsString, repeatParamsString, bboxString]
    .filter(Boolean) // Remove empty strings
    .join('&');
}

export const DEFAULT_TILE_MATRIX_SET_ID = 'WebMercatorQuad';

/**
 * The tiles endpoint that defaulted the tile matrix set was deprecated in tipg
 * 0.7.0 and removed in 1.0.0, so the matrix set id has to be in the path.
 * https://github.com/developmentseed/tipg/blob/main/CHANGES.md#100---2025-03-07
 */
export function buildFeaturesTileUrl(
  featuresApiEndpoint: string,
  tileParams?: string,
  tileMatrixSetId: string = DEFAULT_TILE_MATRIX_SET_ID
): string {
  const tileUrl = `${featuresApiEndpoint}/tiles/${tileMatrixSetId}/{z}/{x}/{y}`;
  return tileParams ? `${tileUrl}?${tileParams}` : tileUrl;
}

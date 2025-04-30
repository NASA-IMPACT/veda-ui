import qs from 'qs';
export function formatTitilerParameter(params): string {
  // array<any> parameter except the one comma delimiated (Ex.rescale)
  // https://openveda.cloud/api/raster/docs#/STAC%20Search/tilejson_searches__search_id___tileMatrixSetId__tilejson_json_get
  const { bands, bidx, asset_bidx, assets, bbox, ...regularParams } = params;

  const repeatParams: Record<string, string[] | undefined> = {
    bands,
    assets,
    bidx,
    asset_bidx
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

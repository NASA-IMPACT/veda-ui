import React from 'react';
import { Navigate, Route, useParams } from 'react-router';

import { STORIES_PATH } from '$utils/routes';

function DiscoveryRedirect() {
  const { discoveryId } = useParams();
  return <Navigate replace to={`${STORIES_PATH}/${discoveryId}`} />;
}

function ThematicDatasetRedirect({ explore = false }: { explore?: boolean }) {
  const { datasetId } = useParams();
  let url = `/data-catalog/${datasetId}`;
  if (explore) {
    url += '/explore';
  }
  return <Navigate replace to={url} />;
}

/* The following routes are redirect from the legacy thematic areas structure */
export const thematicRoutes = (
  <Route path=':thematicId'>
    <Route index element={<Navigate replace to='/data-catalog' />} />

    <Route
      path='discoveries'
      element={<Navigate replace to={STORIES_PATH} />}
    />
    <Route path='discoveries/:discoveryId' element={<DiscoveryRedirect />} />

    <Route path='datasets' element={<Navigate replace to='/data-catalog' />} />
    <Route path='datasets/:datasetId' element={<ThematicDatasetRedirect />} />
    <Route
      path='datasets/:datasetId/explore'
      element={<ThematicDatasetRedirect explore />}
    />
    <Route path='analysis' element={<Navigate replace to='/analysis' />} />
    <Route
      path='analysis/results'
      element={<Navigate replace to='/analysis/results' />}
    />
    <Route path='*' element={<Navigate replace to='/' />} />
  </Route>
);

export const discoveryRoutes = (
  <Route path='/'>
    <Route
      path='discoveries'
      element={<Navigate replace to={STORIES_PATH} />}
    />
    <Route path='discoveries/:discoveryId' element={<DiscoveryRedirect />} />
  </Route>
);

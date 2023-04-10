import React, { lazy } from 'react';
import { Navigate, Route, useParams } from 'react-router';

import { DISCOVERIES_PATH } from '$utils/routes';

const Home = lazy(() => import('$components/home'));

function ThematicAboutRedirect() {
  const { thematicId } = useParams();
  return <Navigate replace to={`/${thematicId}`} />;
}

function ThematicDiscoveryRedirect() {
  const { discoveryId } = useParams();
  return <Navigate replace to={`/discoveries/${discoveryId}`} />;
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
    {/* TODO : Redirect to discoveries with filters preset to thematic? */}
    {/* TODO : Enable redirection when we want to get rid of thematic area index pages */}
    {/* <Route index element={<Navigate replace to='/' />} /> */}
    <Route index element={<Home />} />

    {/* TODO : Redirect to discoveries with filters preset to thematic? */}
    <Route
      path='discoveries'
      element={<Navigate replace to={DISCOVERIES_PATH} />}
    />
    <Route
      path='discoveries/:discoveryId'
      element={<ThematicDiscoveryRedirect />}
    />

    {/* TODO : Redirect to data-catalog with filters preset to thematic? */}
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
    <Route path='about' element={<ThematicAboutRedirect />} />
  </Route>
);

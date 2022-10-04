import React, { useState } from 'react';
import styled from 'styled-components';
import { useQueryClient } from '@tanstack/react-query';
import { datasets } from 'delta/thematics';
import { FormCheckable } from '@devseed-ui/form';
import { Button } from '@devseed-ui/button';
import { Toolbar } from '@devseed-ui/toolbar';

import Constrainer from '$styles/constrainer';
import { PageMainContent } from '$styles/page';

import Chart from '$components/common/chart/analysis/';
import { dateFormatter } from '$components/common/chart/utils';
import { requestStacDatasetsTimeseries } from '$components/analysis/results/timeseries-data';
import { utcString2userTzDate } from '$utils/date';

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
`;

const date = {
  start: utcString2userTzDate('2015-01-01T00:00:00.000Z'),
  end: utcString2userTzDate('2022-01-01T00:00:00.000Z')
};

// Must be a MultiPolygon since the api is currently crashing with a Polygon FC.
const aoi = {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'MultiPolygon',
    coordinates: [
      [
        [
          [-180, -90],
          [180, -90],
          [180, 90],
          [-180, 90],
          [-180, -90]
        ]
      ]
    ]
  }
};

export default function SandboxRequest() {
  const [selectedLayers, setSelectedLayers] = useState([]);
  const [requestStatus, setRequestStatus] = useState([]);

  /* eslint-disable-next-line */
  console.log('Requets status', requestStatus);

  const queryClient = useQueryClient();

  const getData = (selectedLayers_) => {
    const layers = Object.values(datasets)
      .flatMap((d) => d.data.layers)
      .filter((d) => selectedLayers_.includes(d.id));

    setRequestStatus([]);
    queryClient.cancelQueries(['analysis']);
    const requester = requestStacDatasetsTimeseries({
      date,
      aoi,
      layers,
      queryClient
    });

    requester.on('data', (data, index) => {
      setRequestStatus((dataStore) =>
        Object.assign([], dataStore, {
          [index]: data
        })
      );
    });
  };

  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          {Object.values(datasets).map((d) => (
            <ul key={d.data.id}>
              <li>
                <h2>{d.data.name}</h2>
                {d.data.layers.map((l) => (
                  <FormCheckable
                    key={l.id}
                    id={l.id}
                    name={l.id}
                    type='checkbox'
                    checked={selectedLayers.includes(l.id)}
                    onChange={() => {
                      setSelectedLayers((v) => {
                        return v.includes(l.id)
                          ? v.filter((id) => id !== l.id)
                          : v.concat(l.id);
                      });
                    }}
                  >
                    {l.name}
                  </FormCheckable>
                ))}
              </li>
            </ul>
          ))}
        </Wrapper>
        <Wrapper>
          <Toolbar>
            <Button
              variation='primary-fill'
              onClick={() => getData(selectedLayers)}
            >
              Selected
            </Button>
            <Button
              variation='primary-fill'
              onClick={() => {
                setSelectedLayers([
                  'blue-tarp-planetscope',
                  'no2-monthly-diff'
                ]);
                getData(['blue-tarp-planetscope', 'no2-monthly-diff']);
              }}
            >
              No2 and Blue Tarp
            </Button>
            <Button
              variation='primary-fill'
              onClick={() => {
                setSelectedLayers(['hls-s30-002-ej']);
                getData(['hls-s30-002-ej']);
              }}
            >
              HLS
            </Button>
          </Toolbar>
        </Wrapper>
        <Wrapper>
          {!!requestStatus.length && (
            <ul>
              {requestStatus.map((l) => (
                <li key={l.id}>
                  <h5>{l.name}</h5>
                  {l.status === 'errored' && (
                    <p>Something went wrong: {l.error.message}</p>
                  )}

                  {l.status === 'loading' && (
                    <p>
                      {l.meta.loaded} of {l.meta.total} loaded. Wait
                    </p>
                  )}

                  {l.status === 'succeeded' && !!l.data.timeseries.length && (
                    <>
                      <p>All good. Can show data now.</p>
                      <Chart
                        timeSeriesData={l.data.timeseries}
                        uniqueKeys={[
                          { label: 'Min', value: 'min', active: true },
                          { label: 'Max', value: 'max', active: true },
                          { label: 'STD', value: 'std', active: true }
                        ]}
                        xKey='date'
                        dates={l.data.timeseries.map((e) =>
                          dateFormatter(new Date(e.date), '%Y/%m')
                        )}
                        dateFormat='%Y/%m'
                        altTitle='alt title'
                        altDesc='alt desc'
                        xAxisLabel='x axis label'
                        yAxisLabel='y axis label'
                      />
                    </>
                  )}

                  {l.status === 'succeeded' && !l.data.timeseries.length && (
                    <p>There is no data available</p>
                  )}
                </li>
              ))}
            </ul>
          )}
          {/* <Chart
            timeSeriesData={dataForChart1.timeSeriesData}
            uniqueKeys={dynamicUniqueKeys}
            xKey={dataForChart1.xKey}
            dates={dataForChart1.dates}
            dateFormat={dataForChart1.dateFormat}
            altTitle='alt title'
            altDesc='alt desc'
            xAxisLabel='x axis label'
            yAxisLabel='y axis label'
          /> */}
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

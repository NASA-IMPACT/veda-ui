import { FormCheckable } from '@devseed-ui/form';
import React, { useState } from 'react';
import styled from 'styled-components';

import Constrainer from '../../../styles/constrainer';
import { PageMainContent } from '../../../styles/page';

import MapboxMap from '../../common/mapbox';

const DemoMap = styled(MapboxMap)`
  height: 40rem;
`;

const Wrapper = styled.div`
  grid-column: 1 / -1;
`;

// Fake dataset definition
const layers = [
  {
    dataset: 'sandbox',
    layer: 'no2-monthly',
    hasCompare: true,
    domain: [
      '2021-12-01T00:00:00Z',
      '2021-11-01T00:00:00Z',
      '2021-10-01T00:00:00Z',
      '2021-09-01T00:00:00Z',
      '2021-08-01T00:00:00Z',
      '2021-07-01T00:00:00Z',
      '2021-06-01T00:00:00Z',
      '2021-05-01T00:00:00Z',
      '2021-04-01T00:00:00Z',
      '2021-03-01T00:00:00Z',
      '2021-02-01T00:00:00Z',
      '2021-01-01T00:00:00Z'
    ]
  },
  {
    dataset: 'sandbox',
    layer: 'nightlights-hd-monthly',
    hasCompare: false,
    domain: [
      '2020-12-01T00:00:00Z',
      '2020-11-01T00:00:00Z',
      '2020-10-01T00:00:00Z',
      '2020-09-01T00:00:00Z',
      '2020-08-01T00:00:00Z',
      '2020-07-01T00:00:00Z',
      '2020-06-01T00:00:00Z',
      '2020-05-01T00:00:00Z',
      '2020-04-01T00:00:00Z',
      '2020-03-01T00:00:00Z',
      '2020-02-01T00:00:00Z',
      '2020-01-01T00:00:00Z'
    ]
  }
];

function SandboxMap() {
  const [params, setParams] = useState({
    dataset: null,
    layer: null,
    date: null,
    compare: false,
    compareSupport: true
  });

  // TODO Domain belongs to the dataset and should be requested here, after the layer gets selected.

  return (
    <PageMainContent>
      <Constrainer>
        <Wrapper>
          <div>
            <p>
              Compare it enabled globally. If not supported by the enabled layer
              it is disabled.
            </p>
            <FormCheckable
              type='checkbox'
              id='comparing'
              name='layer-compare'
              checked={params.compare}
              disabled={!params.compareSupport}
              onChange={() => {
                setParams((v) => ({
                  ...v,
                  compare: !v.compare
                }));
              }}
            >
              Compare{!params.compareSupport && '(N/A)'}
            </FormCheckable>
            <hr />

            <div>
              <p>
                Dates also depend from the selected layer. When a layer is
                selected a request has to be made to get the temporal domain.
              </p>

              <select
                value={params.date?.getTime() || ''}
                onChange={(e) => {
                  setParams((v) => ({
                    ...v,
                    date: e.target.value
                      ? new Date(parseInt(e.target.value))
                      : null
                  }));
                }}
              >
                <option value=''>Date</option>
                {layers
                  .find((l) => l.layer === params.layer)
                  ?.domain.map((d) => (
                    <option key={d} value={new Date(d).getTime()}>
                      {d}
                    </option>
                  ))}
              </select>
            </div>
            <hr />
            <div>
              {layers.map((l) => (
                <FormCheckable
                  key={l.layer}
                  type='radio'
                  id={l.layer}
                  name='layer'
                  onChange={() => {
                    setParams((v) => ({
                      ...v,
                      dataset: l.dataset,
                      layer: l.layer,
                      compareSupport: l.hasCompare,
                      compare: l.hasCompare ? v.compare : false,
                      date: l.domain ? new Date(l.domain[0]) : null
                    }));
                  }}
                >
                  {l.layer}
                </FormCheckable>
              ))}
            </div>
          </div>
          <DemoMap
            datasetId={params.dataset}
            layerId={params.layer}
            date={params.date}
            isComparing={params.compare}
          />
        </Wrapper>
      </Constrainer>
    </PageMainContent>
  );
}

export default SandboxMap;

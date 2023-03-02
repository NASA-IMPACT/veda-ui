import React, { useState } from 'react';
import styled from 'styled-components';
import { uniq } from 'lodash';
import {
  Form,
  FormCheckable,
  FormCheckableGroup,
  FormInput
} from '@devseed-ui/form';
import { glsp } from '@devseed-ui/theme-provider';
import { datasets } from 'veda/thematics';

import TextHighlight from './text-highlight';

import { Fold } from '$components/common/fold';
import { Card, CardList } from '$components/common/card';

const Wrapper = styled.div`
  position: relative;
  grid-column: 1 / -1;
  display: flex;
  flex-flow: column;
  gap: ${glsp(2)};
`;

const colormapOptions = uniq(
  Object.values(datasets)
    .flatMap((d) =>
      d?.data.layers.flatMap((l) => l.sourceParams?.colormap_name)
    )
    .filter(Boolean)
);

function toggleArrayVal(array, val) {
  return array.includes(val)
    ? array.filter((v) => v !== val)
    : array.concat(val);
}

function findDatasets({ search, hasCompare, colormaps }) {
  let filtered = Object.values(datasets).map((d) => d!.data);

  // Does the free text search appear in specific fields?
  if (search?.length >= 3) {
    filtered = filtered.filter(
      (d) =>
        d.name.includes(search) ||
        d.description.includes(search) ||
        d.layers.some((l) => l.stacCol.includes(search))
    );
  }

  if (hasCompare) {
    // Does any layer have a compare?
    filtered = filtered.filter((d) => d.layers.some((l) => !!l.compare));
  }

  if (colormaps.length) {
    // Does any layer have a matching colormap?
    filtered = filtered.filter((d) =>
      d.layers.some((l) => colormaps.includes(l.sourceParams?.colormap_name))
    );
  }

  return filtered;
}

function SandboxSearch() {
  const [searchVal, setSearchVal] = useState('');
  const [hasCompare, setHasCompare] = useState(false);
  const [colormaps, setColormaps] = useState<string[]>([]);

  const foundDatasets = findDatasets({
    search: searchVal,
    hasCompare,
    colormaps
  });

  return (
    <Fold>
      <Wrapper>
        <Form>
          <label htmlFor='dataset-search-input'>Search Datasets</label>
          <FormInput
            id='dataset-search-input'
            type='text'
            onChange={(e) => setSearchVal(e.target.value)}
            value={searchVal}
            placeholder='Start typing...'
          />
        </Form>
        <div>
          <FormCheckable
            type='checkbox'
            name='has-compare'
            id='has-compare'
            value='has-compare'
            checked={hasCompare}
            onChange={() => setHasCompare((v) => !v)}
          >
            Has compare layer
          </FormCheckable>
        </div>
        <div>
          <label>Colormap</label>
          <FormCheckableGroup>
            {colormapOptions.map((t) => (
              <FormCheckable
                key={t}
                type='checkbox'
                name={t}
                id={t}
                value={t}
                checked={colormaps.includes(t)}
                onChange={() => setColormaps(toggleArrayVal(colormaps, t))}
              >
                {t}
              </FormCheckable>
            ))}
          </FormCheckableGroup>
        </div>
        <h2>Results</h2>
        {foundDatasets.length ? (
          <CardList>
            {foundDatasets.map((d) => (
              <li key={d.id}>
                <Card
                  cardType='cover'
                  linkLabel='View more'
                  linkTo={d.id}
                  title={
                    <TextHighlight
                      value={searchVal}
                      disabled={searchVal.length < 3}
                    >
                      {d.name}
                    </TextHighlight>
                  }
                  parentName='Dataset'
                  description={
                    <TextHighlight
                      value={searchVal}
                      disabled={searchVal.length < 3}
                    >
                      {d.description}
                    </TextHighlight>
                  }
                  imgSrc={d.media?.src}
                  imgAlt={d.media?.alt}
                />
              </li>
            ))}
          </CardList>
        ) : (
          <p>No datasets match the search criteria</p>
        )}
      </Wrapper>
    </Fold>
  );
}

export default SandboxSearch;

import React, { useState } from 'react';
import styled from 'styled-components';
import { Form, FormInput } from '@devseed-ui/form';
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

function findDatasets(val) {
  if (val?.length < 3) return null;

  return Object.values(datasets)
    .filter(
      (d) =>
        d && (d.data.name.includes(val) || d.data.description.includes(val))
    )
    .map((d) => d!.data);
}

function SandboxSearch() {
  const [searchVal, setSearchVal] = useState('');

  const foundDatasets = findDatasets(searchVal);

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
        {foundDatasets &&
          (foundDatasets.length ? (
            <CardList>
              {foundDatasets.map((d) => (
                <li key={d.id}>
                  <Card
                    cardType='cover'
                    linkLabel='View more'
                    linkTo={d.id}
                    title={
                      <TextHighlight value={searchVal}>{d.name}</TextHighlight>
                    }
                    parentName='Dataset'
                    description={
                      <TextHighlight value={searchVal}>
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
          ))}
      </Wrapper>
    </Fold>
  );
}

export default SandboxSearch;

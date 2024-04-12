import React from 'react';
import styled from 'styled-components';
import SearchField from '$components/common/search-field';
import CheckableFilters from '$components/common/form/checkable-filter';
import { BrowserControlsAction } from '$components/common/browse-controls/use-browse-controls';
import { Taxonomy } from 'veda';


interface FiltersMenuProps {
  handleSearch: BrowserControlsAction;
  width?: number;
  taxonomiesOptions: Taxonomy[];
}

const ControlsWrapper = styled.div`
  width: 100%;
  min-width: 20rem;
`;

export default function FiltersControl(props: FiltersMenuProps) {
  const {
    handleSearch,
    width,
    taxonomiesOptions
  } = props;

  return (
    <ControlsWrapper>
      <SearchField
        size='medium'
        placeholder='Title, description...'
        value='' // @TODO-SANDRA: Hook-up
        onChange={props.handleSearch}
      />
      {
        taxonomiesOptions.map((taxonomy) => (
          <CheckableFilters 
            items={taxonomy.values}
            title={taxonomy.name}
          />
        ))
      }
    </ControlsWrapper>
  );
}
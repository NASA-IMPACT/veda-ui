import React from 'react';
import styled from 'styled-components';
import SearchField from '$components/common/search-field';
import CheckableFilters from '$components/common/form/checkable-filter';
import { BrowserControlsAction } from '$components/common/browse-controls/use-browse-controls';


interface FiltersMenuProps {
  handleSearch: BrowserControlsAction;
}

const ControlsWrapper = styled.div`
`;

export default function FiltersControl(props: FiltersMenuProps) {
  return (
    <ControlsWrapper>
      <SearchField
        size='medium'
        placeholder='Title, description...'
        value='' // @TODO-SANDRA: Hook-up
        onChange={props.handleSearch}
      />
      <CheckableFilters 
        items={["hi", "hello", "bye"]}
        title="test"
      />
    </ControlsWrapper>
  );
}
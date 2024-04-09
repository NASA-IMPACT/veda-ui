import React from 'react';
import SearchField from '$components/common/search-field';

interface FiltersMenuProps {
  handleSearch: () => void;
}

export default function FiltersMenu(props: FiltersMenuProps) {
  return (
    <SearchField
      size='medium'
      placeholder='Title, description...'
      value='' // @TODO-SANDRA: Hook-up
      onChange={props.handleSearch}
    />
  );
}
import React from 'react';

import { Pagination } from './pagination';
import { PaginationContainer } from './pagination-container';

export default function PaginationSandbox() {
  return (
    <PaginationContainer>
      {(props) => <Pagination {...props} />}
    </PaginationContainer>
  );
}

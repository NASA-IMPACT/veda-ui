import React from 'react';

import { Pagination } from './pagination';
import { PaginationContainer } from './pagination-container';

export default function WrappedPagination({
  currentPage,
  setCurrentPage,
  totalPages
}: {
  currentPage: number;
  setCurrentPage: (currentPage: number) => void;
  totalPages: number;
}) {
  return (
    <PaginationContainer {...{ currentPage, setCurrentPage }}>
      {(props) => <Pagination {...props} totalPages={totalPages} />}
    </PaginationContainer>
  );
}

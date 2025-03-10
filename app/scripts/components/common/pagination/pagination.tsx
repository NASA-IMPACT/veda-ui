import React from 'react';
import { USWDSPagination } from '$uswds';

interface PaginationProps {
  currentPage: number;
  onClickNext: () => void;
  onClickPageNumber: (pageNumber: number) => void;
  onClickPrevious: () => void;
  totalPages: number;
}

export const Pagination = ({
  currentPage,
  onClickNext,
  onClickPageNumber,
  onClickPrevious,
  totalPages
}: PaginationProps) => {
  return (
    <USWDSPagination
      currentPage={currentPage}
      maxSlots={7}
      totalPages={totalPages}
      onClickNext={onClickNext}
      onClickPageNumber={(event) => {
        const target = event.target as HTMLElement;
        const pageNumber = parseInt(target.innerText);
        onClickPageNumber(pageNumber);
      }}
      onClickPrevious={onClickPrevious}
      pathname='/pagination'
    />
  );
};

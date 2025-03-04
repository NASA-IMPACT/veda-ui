import React from 'react';
import {
  GridContainer as USWDSGridContainer,
  Grid as USWDSGrid,
  Pagination as USWDSPagination
} from '@trussworks/react-uswds';

import { HugResetter } from '../index';

interface PaginationProps {
  currentPage: number;
  onClickNext: () => void;
  onClickPageNumber: (pageNumber: number) => void;
  onClickPrevious: () => void;
}

export const Pagination = ({
  currentPage,
  onClickNext,
  onClickPageNumber,
  onClickPrevious
}: PaginationProps) => {
  return (
    <HugResetter>
      <USWDSGridContainer>
        <USWDSGrid row>
          <USWDSGrid col={12} className='margin-top-2 margin-bottom-3'>
            <h2>Explore USWDS Pagination</h2>
          </USWDSGrid>
        </USWDSGrid>
        <USWDSGrid row gap={3}>
          <USWDSGrid col={12} className='margin-top-2 margin-bottom-3'>
            <USWDSPagination
              currentPage={currentPage}
              maxSlots={7}
              onClickNext={onClickNext}
              onClickPageNumber={(event) => {
                const target = event.target as HTMLElement;
                const pageNumber = parseInt(target.innerText);
                onClickPageNumber(pageNumber);
              }}
              onClickPrevious={onClickPrevious}
              pathname='/pagination'
            />
          </USWDSGrid>
        </USWDSGrid>
      </USWDSGridContainer>
    </HugResetter>
  );
};

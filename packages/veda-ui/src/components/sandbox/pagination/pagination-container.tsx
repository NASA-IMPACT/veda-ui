import { useState } from 'react';

export function PaginationContainer({ children }) {
  const [currentPage, setCurrentPage] = useState(10);

  const onClickNext = () => {
    setCurrentPage(currentPage + 1);
  };

  const onClickPrevious = () => {
    setCurrentPage(currentPage - 1);
  };

  const onClickPageNumber = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return children({
    currentPage,
    onClickNext,
    onClickPageNumber,
    onClickPrevious
  });
}

'use client';

export function PaginationContainer({ currentPage, setCurrentPage, children }) {
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

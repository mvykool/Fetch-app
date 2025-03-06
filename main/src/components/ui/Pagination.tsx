import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  loading,
}) => {
  // Generate page numbers to show
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show a subset of pages with ellipsis
      if (currentPage <= 3) {
        // Near the start
        for (let i = 1; i <= Math.min(4, totalPages); i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Somewhere in the middle
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  const handlePageChange = (page: number) => {
    if (page === currentPage || page < 1 || page > totalPages || loading) {
      return;
    }
    onPageChange(page);
  };

  if (totalPages <= 1) {
    return null; // Don't show pagination if there's only one page
  }

  return (
    <nav className="flex justify-center my-6" aria-label="Pagination">
      <ul className="flex items-center space-x-1">
        {/* Previous page button */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage || loading}
            className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              !hasPrevPage || loading
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
            aria-label="Previous page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>

        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <li key={index}>
            {page === "..." ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => handlePageChange(page as number)}
                disabled={loading}
                className={`relative inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${
                  page === currentPage
                    ? "bg-blue-600 text-white"
                    : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                }`}
              >
                {page}
              </button>
            )}
          </li>
        ))}

        {/* Next page button */}
        <li>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNextPage || loading}
            className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              !hasNextPage || loading
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            }`}
            aria-label="Next page"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

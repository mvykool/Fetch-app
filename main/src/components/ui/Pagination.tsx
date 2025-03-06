interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  onPageChange: (page: number) => void;
  loading: boolean;
}

const Pagination = ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  onPageChange,
  loading,
}: PaginationProps) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= Math.min(4, totalPages); i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push("...");
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
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
    return null;
  }

  return (
    <nav className="flex justify-center my-6" aria-label="Pagination">
      <ul className="flex items-center space-x-1">
        <li>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrevPage || loading}
            className={`relative inline-flex items-center px-3 py-2 rounded-md text-sm font-medium ${
              !hasPrevPage || loading
                ? "text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaryHover"
            }`}
            aria-label="Previous page"
          >
            <i className="bx bx-chevron-left text-2xl"></i>
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
                    ? "bg-Coltext text-white"
                    : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaryHover"
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
                : "text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primaryHover"
            }`}
            aria-label="Next page"
          >
            <i className="bx bx-chevron-right text-2xl"></i>
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;

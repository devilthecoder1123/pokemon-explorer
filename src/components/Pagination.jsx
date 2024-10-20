import React from "react";

const Pagination = ({ currentPage, totalPages, onNext, onPrevious }) => {
  return (
    <nav
      aria-label="Pagination"
      className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 mt-6"
    >
      <div className="hidden sm:block">
        <p className="text-sm text-gray-700">
          Page <span className="font-medium">{currentPage}</span> of{" "}
          <span className="font-medium">{totalPages}</span>
        </p>
      </div>
      <div className="flex flex-1 justify-between sm:justify-end">
        <button
          onClick={onPrevious}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
            currentPage === 1
              ? "bg-gray-200 text-gray-400"
              : "bg-white text-gray-900"
          } ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0`}
        >
          Previous
        </button>
        <button
          onClick={onNext}
          disabled={currentPage === totalPages}
          className={`relative ml-3 inline-flex items-center rounded-md px-3 py-2 text-sm font-semibold ${
            currentPage === totalPages
              ? "bg-gray-200 text-gray-400"
              : "bg-white text-gray-900"
          } ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus-visible:outline-offset-0`}
        >
          Next
        </button>
      </div>
    </nav>
  );
};

export default Pagination;

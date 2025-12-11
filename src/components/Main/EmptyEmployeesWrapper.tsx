import React from "react";

const EmptyEmployeesWrapper: React.FC = () => (
  <div className="empty-employees-wrapper">
    <div className="empty-employees">
      <img
        src="/assets/not-found.png"
        alt="not-found-icon"
        className="not-found-img"
      />
      <p className="no-employees-text">Nothing found</p>
      <p className="try-different-search-text">
        No results match your search. consider trying different search requests.
      </p>
    </div>
  </div>
);

export default EmptyEmployeesWrapper;

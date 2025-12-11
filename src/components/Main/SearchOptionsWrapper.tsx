import React from "react";

const SearchOptionsWrapper: React.FC<{
  searchMode: "basic" | "advanced";
  setSearchMode: (mode: "basic" | "advanced") => void;
}> = ({ searchMode, setSearchMode }) => (
  <div className="search-options-wrapper">
    <button
      className={searchMode === "basic" ? "basic-btn" : "search-option-btn"}
      id="basic-search-btn"
      onClick={() => setSearchMode("basic")}
    >
      BASIC SEARCH
    </button>
    <button
      className={searchMode === "advanced" ? "advanced-btn" : "search-option-btn"}
      id="advanced-search-btn"
      onClick={() => setSearchMode("advanced")}
    >
      ADVANCED SEARCH
    </button>
  </div>
);

export default SearchOptionsWrapper;

import React from "react";
import searchIcon from "../../public/assets/search-icon.png";

interface BasicSearchInputProps {
  basicSearchQuery: string;
  setBasicSearchQuery: (query: string) => void;
  handleBasicSearch: (e: React.FormEvent) => void;
}

const BasicSearchInput: React.FC<BasicSearchInputProps> = ({
  basicSearchQuery,
  setBasicSearchQuery,
  handleBasicSearch,
}) => (
  <div className="search-input-and-button-wrapper" id="basic-search-wrapper">
    <div className="search-input-wrapper">
      <input
        type="text"
        className="search-input"
        id="search-input"
        placeholder="Search"
        value={basicSearchQuery}
        onChange={(e) => setBasicSearchQuery(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleBasicSearch(e)}
      />
      <img src={searchIcon} alt="search-icon" className="search-icon" />
    </div>
    <div className="search-btn-wrapper">
      <button
        className="search-btn"
        id="search-btn"
        onClick={handleBasicSearch}
      >
        Search
      </button>
    </div>
  </div>
);

export default BasicSearchInput;

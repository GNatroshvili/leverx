import React from "react";
import SearchOptionsWrapper from "./SearchOptionsWrapper";
import BasicSearchInput from "./BasicSearchInput";
import AdvancedSearchInput from "./AdvancedSearchInput";

interface SearchWrapperProps {
  searchMode: "basic" | "advanced";
  setSearchMode: (mode: "basic" | "advanced") => void;
  basicSearchQuery: string;
  setBasicSearchQuery: (query: string) => void;
  handleBasicSearch: (e: React.FormEvent) => void;
  advancedSearch: any;
  setAdvancedSearch: (params: any) => void;
  buildings: string[];
  departments: string[];
  handleAdvancedSearch: (e: React.FormEvent) => void;
}

const SearchWrapper: React.FC<SearchWrapperProps> = ({
  searchMode,
  setSearchMode,
  basicSearchQuery,
  setBasicSearchQuery,
  handleBasicSearch,
  advancedSearch,
  setAdvancedSearch,
  buildings,
  departments,
  handleAdvancedSearch,
}) => (
  <div className="search-wrapper">
    <SearchOptionsWrapper searchMode={searchMode} setSearchMode={setSearchMode} />
    {searchMode === "basic" ? (
      <BasicSearchInput
        basicSearchQuery={basicSearchQuery}
        setBasicSearchQuery={setBasicSearchQuery}
        handleBasicSearch={handleBasicSearch}
      />
    ) : (
      <AdvancedSearchInput
        advancedSearch={advancedSearch}
        setAdvancedSearch={setAdvancedSearch}
        buildings={buildings}
        departments={departments}
        handleAdvancedSearch={handleAdvancedSearch}
      />
    )}
  </div>
);

export default SearchWrapper;

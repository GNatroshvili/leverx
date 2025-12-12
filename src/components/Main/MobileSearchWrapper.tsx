import React from "react";
import searchIcon from "../../public/assets/search-icon.png";

const MobileSearchWrapper: React.FC = () => (
  <div className="mobile-search-wrapper">
    <img src={searchIcon} alt="search-icon" />
    <p className="mobile-search-input">Open search panel</p>
  </div>
);

export default MobileSearchWrapper;

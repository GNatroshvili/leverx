import React from "react";
import searchIcon from "../../public/assets/search-icon.png";

interface NavigationWrapperProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent | React.KeyboardEvent) => void;
}

const NavigationWrapper: React.FC<NavigationWrapperProps> = ({
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => (
  <div className="navigation-wrapper">
    <div>
      <div className="settings-search-wrapper">
        <input
          type="text"
          className="settings-search-input"
          placeholder="Type to search and press Enter"
          value={searchQuery}
          onChange={onSearchChange}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSearchSubmit(e);
            }
          }}
        />
        <img
          src={searchIcon}
          alt="search-icon"
          className="settings-search-icon"
        />
      </div>
    </div>
    <div className="address-book-role-wrapper">
      <div className="vertical-divider"></div>
      <p className="address-book-title">Address book role</p>
    </div>
    <div className="admin-column-wrapper">
      <div className="vertical-divider"></div>
      <p className="admin-title">Admin</p>
    </div>
  </div>
);

export default NavigationWrapper;

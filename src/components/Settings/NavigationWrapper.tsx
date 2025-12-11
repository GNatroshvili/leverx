import React from "react";

const NavigationWrapper: React.FC = () => (
  <div className="navigation-wrapper">
    <div>
      <div className="settings-search-wrapper">
        <input
          type="text"
          className="settings-search-input"
          placeholder="Type to search"
        />
        <img
          src="/assets/search-icon.png"
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

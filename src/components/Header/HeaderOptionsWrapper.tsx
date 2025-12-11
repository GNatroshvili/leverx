import React from "react";

interface HeaderOptionsWrapperProps {
  isUserAdmin: boolean;
  onAddressBook: () => void;
  onSettings?: () => void;
}

const HeaderOptionsWrapper: React.FC<HeaderOptionsWrapperProps> = ({
  isUserAdmin,
  onAddressBook,
  onSettings,
}) => (
  <div className="header-options-wrapper">
    <button className="page-title clickable" onClick={onAddressBook}>
      Address Book
    </button>
    {isUserAdmin && (
      <button className="page-title clickable" onClick={onSettings}>
        Settings
      </button>
    )}
  </div>
);

export default HeaderOptionsWrapper;

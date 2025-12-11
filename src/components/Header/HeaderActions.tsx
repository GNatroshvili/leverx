import React from "react";

interface HeaderActionsProps {
  currentUser: {
    firstName: string;
    lastName: string;
    avatar: string;
    id: string;
  };
  onUserClick: () => void;
  onLogout: () => void;
}

const HeaderActions: React.FC<HeaderActionsProps> = ({
  currentUser,
  onUserClick,
  onLogout,
}) => (
  <div className="header-actions">
    <div
      className="user-data"
      onClick={onUserClick}
      style={{ cursor: "pointer" }}
    >
      {(() => {
        const raw = currentUser.avatar || "/assets/default-avatar.jpg";
        const avatarSrc = raw.startsWith("http")
          ? raw
          : raw.replace(/^\.?\//, "/");
        return (
          <img
            src={avatarSrc}
            alt="avatar"
            className="avatar"
            id="employee-avatar"
          />
        );
      })()}
      <p className="employee-username" id="employee-username">
        {currentUser.firstName} {currentUser.lastName}
      </p>
    </div>
    <div className="list-divider-line"></div>
    <div className="support-btn">
      <img src="/assets/question-mark.png" alt="support-icon" />
      <p className="support-btn-text">Support</p>
    </div>
    <div className="list-divider-line"></div>
    <div className="logout-btn" onClick={onLogout}>
      <img src="/assets/logout.png" alt="logout-icon" />
      <p className="logout-btn-text">Log out</p>
    </div>
  </div>
);

export default HeaderActions;

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  getStoredUser,
  clearStoredUser,
  isAdmin as checkIsAdmin,
} from "../utils/auth";

interface HeaderProps {
  currentUser?: {
    firstName: string;
    lastName: string;
    avatar: string;
    id: string;
  };
  showUserInfo?: boolean;
}

const Header: React.FC<HeaderProps> = ({
  currentUser,
  showUserInfo = false,
}) => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const user = getStoredUser();
  const isUserAdmin = checkIsAdmin();

  const handleLogout = () => {
    clearStoredUser();
    navigate("/");
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleUserClick = () => {
    if (currentUser?.id) {
      navigate(`/employees/${currentUser.id}`);
    }
  };

  return (
    <header>
      <div className="header-wrapper container">
        <div className="header-title">
          <a className="company-name" href="/">
            Leverx
          </a>
          <p className="page-service">EMPLOYEE SERVICES</p>
        </div>

        <div className="header-options-wrapper">
          <button
            className="page-title clickable"
            onClick={() => navigate("/main")}
          >
            Address Book
          </button>
          {isUserAdmin && (
            <button
              className="page-title clickable"
              onClick={() => navigate("/settings")}
            >
              Settings
            </button>
          )}
        </div>

        {showUserInfo && currentUser && (
          <div className="header-actions">
            <div
              className="user-data"
              onClick={handleUserClick}
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
            <div className="logout-btn" onClick={handleLogout}>
              <img src="/assets/logout.png" alt="logout-icon" />
              <p className="logout-btn-text">Log out</p>
            </div>
          </div>
        )}

        <div
          className={`burger-menu-wrapper ${mobileMenuOpen ? "open" : ""}`}
          onClick={toggleMobileMenu}
        >
          <span className="burger-line"></span>
          <span className="burger-line"></span>
          <span className="burger-line"></span>
        </div>

        <div
          className={`menu-backdrop ${mobileMenuOpen ? "open" : ""}`}
          onClick={toggleMobileMenu}
        ></div>

        <nav className={`mobile-nav ${mobileMenuOpen ? "open" : ""}`}>
          {showUserInfo && currentUser && (
            <>
              <div className="nav-wrapper">
                <div className="nav-actions-wrapper">
                  {(() => {
                    const raw =
                      currentUser.avatar || "/assets/default-avatar.jpg";
                    const avatarSrc = raw.startsWith("http")
                      ? raw
                      : raw.replace(/^\.?\//, "/");
                    return (
                      <img
                        src={avatarSrc}
                        alt="burger-avatar"
                        className="burger-avatar"
                        id="mobile-employee-avatar"
                        onClick={handleUserClick}
                        style={{ cursor: "pointer" }}
                      />
                    );
                  })()}
                </div>
                <div className="visible-logout-btn" onClick={handleLogout}>
                  <p id="mobile-employee">
                    {currentUser.firstName} {currentUser.lastName}
                  </p>
                  <p className="sign-out-link">Sign out</p>
                </div>
              </div>
              <div className="list-divider-line"></div>
              <div className="visible-support-btn">
                <img src="/assets/question-mark.png" alt="support-icon" />
                <p className="support-btn-text">Support</p>
              </div>
              <div className="list-divider-line"></div>
              {isUserAdmin && (
                <>
                  <div
                    className="visible-addressbook-btn"
                    onClick={() => navigate("/main")}
                  >
                    <p className="addressbook-btn-text">Address Book</p>
                  </div>
                  <div className="list-divider-line"></div>
                </>
              )}
            </>
          )}
          {!showUserInfo && (
            <div className="nav-wrapper">
              <div className="nav-actions-wrapper">
                <p>Welcome to LeverX</p>
              </div>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;

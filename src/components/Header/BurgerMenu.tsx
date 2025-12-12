import React from "react";

interface BurgerMenuProps {
  mobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  showUserInfo: boolean;
  currentUser?:
    | {
        firstName: string;
        lastName: string;
        avatar: string;
        id: string;
      }
    | undefined;
  isUserAdmin: boolean;
  onUserClick: () => void;
  onLogout: () => void;
  onAddressBook: () => void;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({
  mobileMenuOpen,
  toggleMobileMenu,
  showUserInfo,
  currentUser,
  isUserAdmin,
  onUserClick,
  onLogout,
  onAddressBook,
}) => (
  <>
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
                const raw = currentUser.avatar || "/assets/default-avatar.jpg";
                const avatarSrc = raw.startsWith("http")
                  ? raw
                  : raw.replace(/^\.?\//, "/");
                return (
                  <img
                    src={avatarSrc}
                    alt="burger-avatar"
                    className="burger-avatar"
                    id="mobile-employee-avatar"
                    onClick={onUserClick}
                    style={{ cursor: "pointer" }}
                  />
                );
              })()}
            </div>
            <div className="visible-logout-btn" onClick={onLogout}>
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
          <div
            className="visible-addressbook-btn"
            onClick={() => {
              toggleMobileMenu();
              onAddressBook();
            }}
          >
            <p className="addressbook-btn-text">Address Book</p>
          </div>
          <div className="list-divider-line"></div>
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
  </>
);

export default BurgerMenu;

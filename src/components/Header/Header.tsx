import React from "react";
import { useNavigate } from "react-router-dom";
import {
  getStoredUser,
  clearStoredUser,
  isAdmin as checkIsAdmin,
} from "../../utils/auth";
import HeaderTitle from "./HeaderTitle";
import HeaderOptionsWrapper from "./HeaderOptionsWrapper";
import HeaderActions from "./HeaderActions";
import BurgerMenu from "./BurgerMenu";

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
      navigate(`/users/${currentUser.id}`);
    }
  };

  return (
    <div className="header">
      <div className="header-wrapper container">
        <HeaderTitle />
        <HeaderOptionsWrapper
          isUserAdmin={isUserAdmin}
          onAddressBook={() => navigate("/main")}
          onSettings={() => navigate("/settings")}
        />
        {showUserInfo && currentUser && (
          <HeaderActions
            currentUser={currentUser}
            onUserClick={handleUserClick}
            onLogout={handleLogout}
          />
        )}
        <BurgerMenu
          mobileMenuOpen={mobileMenuOpen}
          toggleMobileMenu={toggleMobileMenu}
          showUserInfo={showUserInfo}
          currentUser={currentUser || undefined}
          isUserAdmin={isUserAdmin}
          onUserClick={handleUserClick}
          onLogout={handleLogout}
          onAddressBook={() => {
            setMobileMenuOpen(false);
            navigate("/main");
          }}
        />
      </div>
    </div>
  );
};

export default Header;

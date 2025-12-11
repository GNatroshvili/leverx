import React from "react";

interface AuthTabsProps {
  activeTab: "signin" | "signup";
  setActiveTab: (tab: "signin" | "signup") => void;
}

const AuthTabs: React.FC<AuthTabsProps> = ({ activeTab, setActiveTab }) => (
  <div className="auth-tabs">
    <button
      className={`auth-tab ${activeTab === "signin" ? "active" : ""}`}
      onClick={() => setActiveTab("signin")}
    >
      SIGN IN
    </button>
    <button
      className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
      onClick={() => setActiveTab("signup")}
    >
      SIGN UP
    </button>
  </div>
);

export default AuthTabs;

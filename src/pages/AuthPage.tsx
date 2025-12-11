import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, setStoredUser, getStoredUser } from "../utils/auth";
import "../../styles/scss/reset.scss";
import "../../styles/scss/layout.scss";
import "../../styles/scss/header.scss";
import "../../styles/scss/authorization.scss";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Sign in form state
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinRemember, setSigninRemember] = useState(false);

  // Sign up form state
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  useEffect(() => {
    // Check if user is already logged in
    const user = getStoredUser();
    if (user) {
      navigate("/main");
    }
  }, [navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signinEmail,
          password: signinPassword,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const user = {
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          employeeId: data.user.employeeId,
          isAdmin: data.user.isAdmin || false,
          role: data.user.role || "employee",
        };

        setStoredUser(user, signinRemember);
        navigate("/main");
      } else {
        alert(data.message || "Sign in failed");
      }
    } catch (error) {
      console.error("Sign in error:", error);
      alert("An error occurred during sign in");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_BASE_URL}/sign-up`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: signupEmail,
          password: signupPassword,
          firstName: signupFirstName,
          lastName: signupLastName,
          phone: signupPhone,
        }),
      });

      const data = await response.json();

      if (data.success) {
        const user = {
          email: data.user.email,
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          phone: data.user.phone,
          employeeId: data.user.employeeId,
          isAdmin: data.user.isAdmin || false,
          role: data.user.role || "employee",
        };

        setStoredUser(user, false);
        navigate("/main");
      } else {
        alert(data.message || "Sign up failed");
      }
    } catch (error) {
      console.error("Sign up error:", error);
      alert("An error occurred during sign up");
    }
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <>
      <header>
        <div className="header-wrapper container">
          <div className="header-title">
            <a className="company-name" href="/">
              Leverx
            </a>
            <p className="page-service">EMPLOYEE SERVICES</p>
          </div>
          <div className="header-actions auth-header-actions">
            <div className="support-btn">
              <img src="/assets/question-mark.png" alt="support-icon" />
              <p className="support-btn-text">Support</p>
            </div>
          </div>
          <div className="burger-menu-wrapper" onClick={toggleMobileMenu}>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
            <span className="burger-line"></span>
          </div>
          <div
            className={`menu-backdrop ${mobileMenuOpen ? "active" : ""}`}
            onClick={toggleMobileMenu}
          ></div>
          <nav className={`mobile-nav ${mobileMenuOpen ? "active" : ""}`}>
            <div className="nav-wrapper">
              <div className="nav-actions-wrapper">
                <p>Welcome to LeverX</p>
              </div>
            </div>
            <div className="list-divider-line"></div>
            <div className="visible-support-btn">
              <img src="/assets/question-mark.png" alt="support-icon" />
              <p className="support-btn-text">Support</p>
            </div>
          </nav>
        </div>
      </header>

      <div className="auth-page-wrapper container">
        <div className="auth-container">
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

          {/* Sign In Form */}
          {activeTab === "signin" && (
            <div className="auth-form-wrapper">
              <form className="auth-form" onSubmit={handleSignIn}>
                <div className="form-group">
                  <label className="input-label" htmlFor="signin-email">
                    Email
                  </label>
                  <input
                    type="email"
                    className="auth-input"
                    id="signin-email"
                    placeholder="Enter your email"
                    value={signinEmail}
                    onChange={(e) => setSigninEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="input-label" htmlFor="signin-password">
                    Password
                  </label>
                  <input
                    type="password"
                    className="auth-input"
                    id="signin-password"
                    placeholder="Enter your password"
                    value={signinPassword}
                    onChange={(e) => setSigninPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="auth-btn">
                    Sign In
                  </button>
                </div>
                <div className="form-group checkbox-group">
                  <input
                    type="checkbox"
                    id="remember-me"
                    checked={signinRemember}
                    onChange={(e) => setSigninRemember(e.target.checked)}
                  />
                  <label htmlFor="remember-me">Remember me</label>
                </div>
              </form>
            </div>
          )}

          {/* Sign Up Form */}
          {activeTab === "signup" && (
            <div className="auth-form-wrapper">
              <form className="auth-form" onSubmit={handleSignUp}>
                <div className="form-group">
                  <label className="input-label" htmlFor="signup-firstname">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="auth-input"
                    id="signup-firstname"
                    placeholder="Enter your first name"
                    value={signupFirstName}
                    onChange={(e) => setSignupFirstName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="input-label" htmlFor="signup-lastname">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="auth-input"
                    id="signup-lastname"
                    placeholder="Enter your last name"
                    value={signupLastName}
                    onChange={(e) => setSignupLastName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="input-label" htmlFor="signup-email">
                    Email
                  </label>
                  <input
                    type="email"
                    className="auth-input"
                    id="signup-email"
                    placeholder="Enter your email"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="input-label" htmlFor="signup-phone">
                    Phone
                  </label>
                  <input
                    type="tel"
                    className="auth-input"
                    id="signup-phone"
                    placeholder="Enter your phone number"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="input-label" htmlFor="signup-password">
                    Password
                  </label>
                  <input
                    type="password"
                    className="auth-input"
                    id="signup-password"
                    placeholder="Create a password"
                    value={signupPassword}
                    onChange={(e) => setSignupPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <button type="submit" className="auth-btn">
                    Sign Up
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AuthPage;

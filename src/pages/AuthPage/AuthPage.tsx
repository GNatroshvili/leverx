import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL, setStoredUser, getStoredUser } from "../../utils/auth";
import Header from "../../components/Header/Header";
import AuthTabs from "../../components/Auth/AuthTabs";
import SignUpForm from "../../components/Auth/SignUpForm";
import SignInForm from "../../components/Auth/SignInForm";
import "../../components/Auth/authorization.scss";
import "../../components/Header/header.scss";
import "../../layout.scss";
import "../../reset.scss";

const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinRemember, setSigninRemember] = useState(false);
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

  return (
    <>
      <Header showUserInfo={false} />
      <div className="auth-page-wrapper container">
        <div className="auth-container">
          <AuthTabs activeTab={activeTab} setActiveTab={setActiveTab} />
          {activeTab === "signin" && (
            <SignInForm
              signinEmail={signinEmail}
              setSigninEmail={setSigninEmail}
              signinPassword={signinPassword}
              setSigninPassword={setSigninPassword}
              signinRemember={signinRemember}
              setSigninRemember={setSigninRemember}
              handleSignIn={handleSignIn}
            />
          )}
          {activeTab === "signup" && (
            <SignUpForm
              signupFirstName={signupFirstName}
              setSignupFirstName={setSignupFirstName}
              signupLastName={signupLastName}
              setSignupLastName={setSignupLastName}
              signupEmail={signupEmail}
              setSignupEmail={setSignupEmail}
              signupPhone={signupPhone}
              setSignupPhone={setSignupPhone}
              signupPassword={signupPassword}
              setSignupPassword={setSignupPassword}
              handleSignUp={handleSignUp}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AuthPage;

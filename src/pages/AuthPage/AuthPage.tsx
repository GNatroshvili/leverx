import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setStoredUser, getStoredUser } from "../../utils/auth";
import { useSignInMutation, useSignUpMutation, api } from "../../store/api";
import { useDispatch } from "react-redux";
import Header from "../../components/Header/Header";
import AuthTabs from "../../components/Auth/AuthTabs";
import SignUpForm from "../../components/Auth/SignUpForm";
import SignInForm from "../../components/Auth/SignInForm";
import "../../components/Auth/authorization.scss";
import "../../components/Header/header.scss";
import "../../layout.css";
import "../../index.css";

const AuthPage: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"signin" | "signup">("signin");
  const [signinEmail, setSigninEmail] = useState("");
  const [signinPassword, setSigninPassword] = useState("");
  const [signinRemember, setSigninRemember] = useState(false);
  const [signinError, setSigninError] = useState<string | null>(null);
  const [signupFirstName, setSignupFirstName] = useState("");
  const [signupLastName, setSignupLastName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPhone, setSignupPhone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupError, setSignupError] = useState<string | null>(null);

  useEffect(() => {
    // Check if user is already logged in
    const user = getStoredUser();
    if (user) {
      navigate("/main");
    }
  }, [navigate]);

  const [signIn] = useSignInMutation();
  const [signUp] = useSignUpMutation();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setSigninError(null);
    try {
      const data = await signIn({
        email: signinEmail,
        password: signinPassword,
      }).unwrap();
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
        setSigninError("Invalid credentials");
      }
    } catch (error) {
      setSigninError("Invalid credentials");
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupError(null);
    // client-side validation
    if (signupFirstName.trim().length < 2) {
      setSignupError("First name must be at least 2 characters.");
      return;
    }
    if (signupLastName.trim().length < 2) {
      setSignupError("Last name must be at least 2 characters.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      setSignupError("Please enter a valid email address.");
      return;
    }
    const phoneDigits = signupPhone.replace(/\D/g, "");
    if (phoneDigits.length < 4) {
      setSignupError("Phone number must be at least 4 digits.");
      return;
    }
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(signupPassword)) {
      setSignupError(
        "Password must be at least 8 characters and contain at least one uppercase letter."
      );
      return;
    }
    try {
      const data = await signUp({
        email: signupEmail,
        password: signupPassword,
        firstName: signupFirstName,
        lastName: signupLastName,
        phone: signupPhone,
      }).unwrap();
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
        // invalidate users cache so main page fetches new list
        dispatch(api.util.invalidateTags([{ type: "Users" }]));
        navigate("/main");
      } else {
        setSignupError(data.message || "Sign up failed");
      }
    } catch (error: any) {
      setSignupError(
        error?.data?.message || "An error occurred during sign up"
      );
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
              signinError={signinError}
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
              signupError={signupError}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default AuthPage;

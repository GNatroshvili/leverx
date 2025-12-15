import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { setStoredUser, getStoredUser } from "../../utils/auth";
import { useSignInMutation, useSignUpMutation, api } from "../../store/api";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../store";
import {
  setActiveTab,
  setSigninEmail,
  setSigninPassword,
  setSigninRemember,
  setSigninError,
  setSignupFirstName,
  setSignupLastName,
  setSignupEmail,
  setSignupPhone,
  setSignupPassword,
  setSignupError,
  resetAuthPageState,
} from "../../store/authPageSlice";
import { setUser } from "../../store/userSlice";
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
  const {
    activeTab,
    signinEmail,
    signinPassword,
    signinRemember,
    signinError,
    signupFirstName,
    signupLastName,
    signupEmail,
    signupPhone,
    signupPassword,
    signupError,
  } = useSelector((state: RootState) => state.authPage);

  useEffect(() => {
    // Check if user is already logged in
    const user = getStoredUser();
    if (user) {
      dispatch(setUser(user));
      navigate("/main");
    }
  }, [navigate, dispatch]);

  const [signIn] = useSignInMutation();
  const [signUp] = useSignUpMutation();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSigninError(null));
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
        dispatch(setUser(user));
        dispatch(resetAuthPageState());
        navigate("/main");
      } else {
        dispatch(setSigninError("Invalid credentials"));
      }
    } catch (error) {
      dispatch(setSigninError("Invalid credentials"));
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSignupError(null));
    // client-side validation
    if (signupFirstName.trim().length < 2) {
      dispatch(setSignupError("First name must be at least 2 characters."));
      return;
    }
    if (signupLastName.trim().length < 2) {
      dispatch(setSignupError("Last name must be at least 2 characters."));
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(signupEmail)) {
      dispatch(setSignupError("Please enter a valid email address."));
      return;
    }
    const phoneDigits = signupPhone.replace(/\D/g, "");
    if (phoneDigits.length < 4) {
      dispatch(setSignupError("Phone number must be at least 4 digits."));
      return;
    }
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(signupPassword)) {
      dispatch(
        setSignupError(
          "Password must be at least 8 characters and contain at least one uppercase letter."
        )
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
        dispatch(setUser(user));
        dispatch(resetAuthPageState());
        // invalidate users cache so main page fetches new list
        dispatch(api.util.invalidateTags([{ type: "Users" }]));
        navigate("/main");
      } else {
        dispatch(setSignupError(data.message || "Sign up failed"));
      }
    } catch (error: any) {
      dispatch(
        setSignupError(
          error?.data?.message || "An error occurred during sign up"
        )
      );
    }
  };

  return (
    <>
      <Header showUserInfo={false} />
      <div className="auth-page-wrapper container">
        <div className="auth-container">
          <AuthTabs
            activeTab={activeTab}
            setActiveTab={(tab) => dispatch(setActiveTab(tab))}
          />
          {activeTab === "signin" && (
            <SignInForm
              signinEmail={signinEmail}
              setSigninEmail={(v) => dispatch(setSigninEmail(v))}
              signinPassword={signinPassword}
              setSigninPassword={(v) => dispatch(setSigninPassword(v))}
              signinRemember={signinRemember}
              setSigninRemember={(v) => dispatch(setSigninRemember(v))}
              handleSignIn={handleSignIn}
              signinError={signinError}
            />
          )}
          {activeTab === "signup" && (
            <SignUpForm
              signupFirstName={signupFirstName}
              setSignupFirstName={(v) => dispatch(setSignupFirstName(v))}
              signupLastName={signupLastName}
              setSignupLastName={(v) => dispatch(setSignupLastName(v))}
              signupEmail={signupEmail}
              setSignupEmail={(v) => dispatch(setSignupEmail(v))}
              signupPhone={signupPhone}
              setSignupPhone={(v) => dispatch(setSignupPhone(v))}
              signupPassword={signupPassword}
              setSignupPassword={(v) => dispatch(setSignupPassword(v))}
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

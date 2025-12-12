import React from "react";

interface SignUpFormProps {
  signupFirstName: string;
  setSignupFirstName: (firstName: string) => void;
  signupLastName: string;
  setSignupLastName: (lastName: string) => void;
  signupEmail: string;
  setSignupEmail: (email: string) => void;
  signupPhone: string;
  setSignupPhone: (phone: string) => void;
  signupPassword: string;
  setSignupPassword: (password: string) => void;
  handleSignUp: (e: React.FormEvent) => void;
  signupError?: string | null;
}

const SignUpForm: React.FC<SignUpFormProps> = ({
  signupFirstName,
  setSignupFirstName,
  signupLastName,
  setSignupLastName,
  signupEmail,
  setSignupEmail,
  signupPhone,
  setSignupPhone,
  signupPassword,
  setSignupPassword,
  handleSignUp,
  signupError,
}) => (
  <div className="auth-form-wrapper">
    <form className="auth-form" onSubmit={handleSignUp}>
      {signupError && (
        <div className="form-error" style={{ color: 'red', marginBottom: 8 }}>
          {signupError}
        </div>
      )}
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
);

export default SignUpForm;

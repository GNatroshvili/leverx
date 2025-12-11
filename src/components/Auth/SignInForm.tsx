import React from "react";

interface SignInFormProps {
  signinEmail: string;
  setSigninEmail: (email: string) => void;
  signinPassword: string;
  setSigninPassword: (password: string) => void;
  signinRemember: boolean;
  setSigninRemember: (remember: boolean) => void;
  handleSignIn: (e: React.FormEvent) => void;
}

const SignInForm: React.FC<SignInFormProps> = ({
  signinEmail,
  setSigninEmail,
  signinPassword,
  setSigninPassword,
  signinRemember,
  setSigninRemember,
  handleSignIn,
}) => (
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
);

export default SignInForm;

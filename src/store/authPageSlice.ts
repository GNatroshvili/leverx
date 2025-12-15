import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface AuthPageState {
  activeTab: "signin" | "signup";
  signinEmail: string;
  signinPassword: string;
  signinRemember: boolean;
  signinError: string | null;
  signupFirstName: string;
  signupLastName: string;
  signupEmail: string;
  signupPhone: string;
  signupPassword: string;
  signupError: string | null;
}

const initialState: AuthPageState = {
  activeTab: "signin",
  signinEmail: "",
  signinPassword: "",
  signinRemember: false,
  signinError: null,
  signupFirstName: "",
  signupLastName: "",
  signupEmail: "",
  signupPhone: "",
  signupPassword: "",
  signupError: null,
};

const authPageSlice = createSlice({
  name: "authPage",
  initialState,
  reducers: {
    setActiveTab(state, action: PayloadAction<"signin" | "signup">) {
      state.activeTab = action.payload;
    },
    setSigninEmail(state, action: PayloadAction<string>) {
      state.signinEmail = action.payload;
    },
    setSigninPassword(state, action: PayloadAction<string>) {
      state.signinPassword = action.payload;
    },
    setSigninRemember(state, action: PayloadAction<boolean>) {
      state.signinRemember = action.payload;
    },
    setSigninError(state, action: PayloadAction<string | null>) {
      state.signinError = action.payload;
    },
    setSignupFirstName(state, action: PayloadAction<string>) {
      state.signupFirstName = action.payload;
    },
    setSignupLastName(state, action: PayloadAction<string>) {
      state.signupLastName = action.payload;
    },
    setSignupEmail(state, action: PayloadAction<string>) {
      state.signupEmail = action.payload;
    },
    setSignupPhone(state, action: PayloadAction<string>) {
      state.signupPhone = action.payload;
    },
    setSignupPassword(state, action: PayloadAction<string>) {
      state.signupPassword = action.payload;
    },
    setSignupError(state, action: PayloadAction<string | null>) {
      state.signupError = action.payload;
    },
    resetAuthPageState(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
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
} = authPageSlice.actions;

export default authPageSlice.reducer;

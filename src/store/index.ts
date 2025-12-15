import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import userReducer from "./userSlice";
import mainPageReducer from "./mainPageSlice";
import authPageReducer from "./authPageSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userReducer,
    mainPage: mainPageReducer,
    authPage: authPageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

import { configureStore } from "@reduxjs/toolkit";
import { api } from "./api";
import userReducer from "./userSlice";
import mainPageReducer from "./mainPageSlice";

export const store = configureStore({
  reducer: {
    [api.reducerPath]: api.reducer,
    user: userReducer,
    mainPage: mainPageReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

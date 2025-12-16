import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3000" }),
  tagTypes: ["Users"],
  endpoints: (builder) => ({
    getUsers: builder.query<any, string | void>({
      query: (search) => search ? `/users?search=${encodeURIComponent(search)}` : "/users",
      providesTags: [{ type: "Users" }],
    }),
    getUserById: builder.query<any, string>({ query: (id) => `/users/${id}` }),
    signIn: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: "/sign-in",
        method: "POST",
        body,
      }),
    }),
    signUp: builder.mutation<any, any>({
      query: (body) => ({
        url: "/sign-up",
        method: "POST",
        body,
      }),
    }),
    updateUser: builder.mutation<
      any,
      { id: string; updates: any; requestingUserEmail: string }
    >({
      query: ({ id, updates, requestingUserEmail }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: { updates, requestingUserEmail },
      }),
    }),
    updateUserRole: builder.mutation<
      any,
      {
        id: string;
        role: string;
        isAdmin: boolean;
        requestingUserEmail: string;
      }
    >({
      query: ({ id, role, isAdmin, requestingUserEmail }) => ({
        url: `/users/${id}/role`,
        method: "PUT",
        body: { role, isAdmin, requestingUserEmail },
      }),
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useSignInMutation,
  useSignUpMutation,
  useUpdateUserMutation,
  useUpdateUserRoleMutation,
} = api;

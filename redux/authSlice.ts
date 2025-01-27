import { User } from "@/schema/types/types.d";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: User | null;
}

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<{ token: string; user: User }>) => {
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.user = action.payload.user; // Set user data when token is set
    },
    clearToken: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
    clearUser: (state) => {
      state.user = null; // Clear user data explicitly
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload; // Set user data directly
    },
  },
});

export const getToken = (state: { auth: AuthState }) => state.auth.token;
// Selector to get the user
export const getUser = (state: { auth: AuthState }) => state.auth.user;

export const { setToken, clearToken, setUser, clearUser } = authSlice.actions; // Export clearUser after setToken and clearToken
export default authSlice.reducer;

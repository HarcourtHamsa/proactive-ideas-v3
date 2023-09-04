import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  auth: {
    user: {
      email: string | null;
      name: string | null;
      id: number | null;
      accessToken: string | null;
    };
    expiresAt: string | null;
  } | null;
}

const initialState: AuthState = {
  auth: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<any>) => {
      state.auth = action.payload;
    },

    resetAuth: (state) => {
      state.auth = null; // Corrected this line
    },
  },
});

export const { setAuth, resetAuth } = authSlice.actions;

export default authSlice.reducer;

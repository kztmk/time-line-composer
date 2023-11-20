import { createSlice } from '@reduxjs/toolkit';
import { AuthProps } from '../../types/auth';
import type { RootState } from '../index';

// const
const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
};

const appAuthSlice = createSlice({
  name: 'appAuth',
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.isInitialized = true;
      state.user = action.payload;
    },
    logedout: (state) => {
      state.isLoggedIn = false;
      state.isInitialized = true;
      state.user = null;
    },
    register: (state, action) => {
      state.user = action.payload;
    },
  },
});

export const selectAppAuth = (state: RootState) => state.appAuth;

export const { login, logedout, register } = appAuthSlice.actions;

export default appAuthSlice.reducer;

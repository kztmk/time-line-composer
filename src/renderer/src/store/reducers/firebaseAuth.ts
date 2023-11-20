/* eslint-disable @typescript-eslint/no-explicit-any */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User as FirebaseUser, getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import type { RootState } from '../index';

export type FirebaseAuthState = {
  user: FirebaseUser | null;
  isLoading: boolean;
  success: 'idle' | 'login' | 'resetPassword' | 'logout';
  isError: boolean;
  error?: string;
};

const initialState: FirebaseAuthState = {
  user: null,
  isLoading: false,
  success: 'idle',
  isError: false,
  error: undefined,
};

export const signIn = createAsyncThunk<
  FirebaseUser,
  { email: string; password: string },
  {
    rejectValue: string;
  }
>('signIn', async (args, thunkApi) => {
  try {
    const auth = getAuth();
    const userCredential = await signInWithEmailAndPassword(auth, args.email, args.password);
    return userCredential.user;
  } catch (error: any) {
    return thunkApi.rejectWithValue(error.message);
  }
});

const firebaseAuthSlice = createSlice({
  name: 'firebaseAuth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signIn.pending, (state) => {
      state.isLoading = true;
      state.isError = false;
      state.success = 'idle';
      state.error = undefined;
    });
    builder.addCase(signIn.fulfilled, (state, action) => {
      state.isLoading = false;
      state.success = 'login';
      state.user = action.payload;
    });
    builder.addCase(signIn.rejected, (state, action) => {
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload;
    });
  },
});

export const selectFirebaseAuth = (state: RootState) => state.firebaseAuth;

export default firebaseAuthSlice.reducer;

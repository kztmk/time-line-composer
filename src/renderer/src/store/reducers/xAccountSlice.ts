// XAccount CRUD Reducer
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { get, getDatabase, push, ref, set } from 'firebase/database';
import type { RootState } from '../index';

import { XAccountData, XAccountListFetchStatus } from '../../types/app';

const initialXAccountList: XAccountData[] = [];

const initialState: XAccountListFetchStatus = {
  xAccountList: initialXAccountList,
  isLoading: false,
  isError: false,
  process: 'idle',
  errorMessage: '',
};

// fetchXAccountList from firebase realtime database
export const fetchXAccountList = createAsyncThunk<
  XAccountData[],
  void,
  { rejectValue: string; state: RootState }
>('fetchXAccountList', async (_, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().appAuth;
    const db = getDatabase();
    const dbRef = ref(db, `userData/${user?.id}/xAccountList`);
    const snapshot = await get(dbRef);
    const data = snapshot.val();
    const xAccountList: XAccountData[] = [];
    if (data) {
      Object.keys(data).forEach((key) => {
        xAccountList.push({
          ...data[key],
          id: key,
        });
      });
    }
    return xAccountList;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// addXAccount to firebase realtime database
export const addXAccount = createAsyncThunk<
  XAccountData,
  XAccountData,
  { rejectValue: string; state: RootState }
>('addXAccount', async (xAccountData, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().appAuth;
    const db = getDatabase();
    const dbRef = ref(db, `userData/${user?.id}/xAccountList`);
    const newXAccountRef = await push(dbRef);
    await set(newXAccountRef, { ...xAccountData, id: newXAccountRef.key });

    const savedXAccount: XAccountData = {
      ...xAccountData,
      id: newXAccountRef.key,
    };
    return savedXAccount;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Update XAccount in firebase realtime database
export const updateXAccount = createAsyncThunk<
  XAccountData,
  XAccountData,
  { rejectValue: string; state: RootState }
>('updateXAccount', async (xAccountData, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().appAuth;
    const db = getDatabase();
    const dbRef = ref(db, `userData/${user?.id}/xAccountList/${xAccountData.id}`);
    await set(dbRef, xAccountData);

    return xAccountData;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

// Delete XAccount from firebase realtime database
export const deleteXAccount = createAsyncThunk<
  XAccountData,
  XAccountData,
  { rejectValue: string; state: RootState }
>('deleteXAccount', async (xAccountData, thunkAPI) => {
  try {
    const { user } = thunkAPI.getState().appAuth;
    const db = getDatabase();
    const dbRef = ref(db, `userData/${user?.id}/xAccountList/${xAccountData.id}`);
    await set(dbRef, null);

    return xAccountData;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message);
  }
});

const xAccountListSlice = createSlice({
  name: 'xAccountList',
  initialState,
  reducers: {
    resetProcess: (state) => {
      state.process = 'idle';
    },
  },
  extraReducers: (builder) => {
    // AddXAccount
    builder.addCase(addXAccount.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(addXAccount.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.process = 'addNew';
      state.xAccountList.push(payload);
    });
    builder.addCase(addXAccount.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = payload as string;
    });
    // UpdateXAccount
    builder.addCase(updateXAccount.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(updateXAccount.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.process = 'update';
      const index = state.xAccountList.findIndex((xAccount) => xAccount.id === payload.id);
      state.xAccountList[index] = payload;
    });
    builder.addCase(updateXAccount.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = payload as string;
    });
    // DeleteXAccount
    builder.addCase(deleteXAccount.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(deleteXAccount.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.process = 'delete';
      const index = state.xAccountList.findIndex((xAccount) => xAccount.id === payload.id);
      state.xAccountList.splice(index, 1);
    });
    builder.addCase(deleteXAccount.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = payload as string;
    });
    // fetchXAccountList
    builder.addCase(fetchXAccountList.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(fetchXAccountList.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.process = 'fetch';
      state.xAccountList = payload;
    });
    builder.addCase(fetchXAccountList.rejected, (state, { payload }) => {
      state.isLoading = false;
      state.isError = true;
      state.errorMessage = payload as string;
    });
  },
});

export const selectXAccountList = (state: RootState) => state.xAccountList;

export const { resetProcess } = xAccountListSlice.actions;
export default xAccountListSlice.reducer;

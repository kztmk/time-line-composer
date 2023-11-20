import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as useAppDispatch,
  useSelector as useAppSelector,
} from 'react-redux';

import appAuth from './reducers/appAuth';
import firebaseAuthReducer from './reducers/firebaseAuth';
import menu from './reducers/menu';
import snackbar from './reducers/snackbar';
import xAccountReducer from './reducers/xAccountSlice';

const rootReducer = combineReducers({
  menu,
  snackbar,
  xAccountList: xAccountReducer,
  firebaseAuth: firebaseAuthReducer,
  appAuth,
});
export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});

export type AppDispatch = typeof store.dispatch;

const { dispatch } = store;

const useDispatch = () => useAppDispatch<AppDispatch>();
const useSelector: TypedUseSelectorHook<RootState> = useAppSelector;

export { dispatch, store, useDispatch, useSelector };

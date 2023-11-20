// Purpose: Reducer for authentication state.
// This reducer for useReducer hook in src/context/FirebaseContext.tsx
// action - state management
import { LOGIN, LOGOUT, REGISTER } from './authActions';

// types
import { AuthActionProps, AuthProps } from '../../types/auth';

// initial state
export const initialState: AuthProps = {
  isLoggedIn: false,
  isInitialized: false,
  user: null,
};

// ==============================|| AUTH REDUCER ||============================== //

// eslint-disable-next-line @typescript-eslint/default-param-last
const auth = (state = initialState, action: AuthActionProps) => {
  switch (action.type) {
    case REGISTER: {
      const { user } = action.payload!;
      return {
        ...state,
        user,
      };
    }
    case LOGIN: {
      const { user } = action.payload!;
      return {
        ...state,
        isLoggedIn: true,
        isInitialized: true,
        user,
      };
    }
    case LOGOUT: {
      return {
        ...state,
        isInitialized: true,
        isLoggedIn: false,
        user: null,
      };
    }
    default: {
      return { ...state };
    }
  }
};

export default auth;

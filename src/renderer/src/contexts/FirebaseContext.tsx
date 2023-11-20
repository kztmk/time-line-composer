import { ReactElement, createContext, useCallback, useEffect, useMemo } from 'react'
// third-party
import { getAuth, updatePassword } from 'firebase/auth'
import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'

// action - state management

// project-imports
import { useSelector } from 'react-redux'
import Loader from '../components/Loader'
import { RootState, useDispatch } from '../store'
import { logedout, login } from '../store/reducers/appAuth'
import { signIn } from '../store/reducers/firebaseAuth'
import { fetchXAccountList } from '../store/reducers/xAccountSlice'
import { FirebaseContextType } from '../types/auth'
// firebase initialize
if (!firebase.apps.length) {
  firebase.initializeApp({
    apiKey: import.meta.env.RENDERER_VITE_API_KEY,
    authDomain: import.meta.env.RENDERER_VITE_AUTH_DOMAIN,
    projectId: import.meta.env.RENDERER_VITE_PROJECT_ID,
    storageBucket: import.meta.env.RENDERER_VITE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.RENDERER_VITE_MESSAGING_SENDER_ID,
    appId: import.meta.env.RENDERER_VITE_APP_ID,
    measurementId: import.meta.env.RENDERER_VITE_MEASUREMENT_ID
  })
}

// ==============================|| FIREBASE CONTEXT & PROVIDER ||============================== //

const FirebaseContext = createContext<FirebaseContextType | null>(null)

export const FirebaseProvider = ({ children }: { children: ReactElement }) => {
  // const [state, dispatch] = useReducer(authReducer, initialState);
  const appAuthState = useSelector((state: RootState) => state.appAuth)

  const dispatch = useDispatch()
  useEffect(
    () =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      firebase.auth().onAuthStateChanged((user: any) => {
        if (user) {
          const appUser = {
            id: user.uid,
            email: user.email!,
            avatar: user.photoURL,
            image: user.photoURL,
            name: user.displayName || ''
          }
          dispatch(login(appUser))
          dispatch(fetchXAccountList())
        } else {
          dispatch(logedout())
        }
      }),
    [dispatch]
  )

  const firebaseEmailPasswordSignIn = useCallback(
    (email: string, password: string) => dispatch(signIn({ email, password })),
    [dispatch]
  )

  const firebaseGoogleSignIn = useCallback(() => {
    const provider = new firebase.auth.GoogleAuthProvider()
    return firebase.auth().signInWithPopup(provider)
  }, [])

  const firebaseTwitterSignIn = useCallback(() => {
    const provider = new firebase.auth.TwitterAuthProvider()
    return firebase.auth().signInWithPopup(provider)
  }, [])

  const firebaseFacebookSignIn = useCallback(() => {
    const provider = new firebase.auth.FacebookAuthProvider()
    return firebase.auth().signInWithPopup(provider)
  }, [])

  const firebaseRegister = useCallback(
    async (email: string, password: string) =>
      firebase.auth().createUserWithEmailAndPassword(email, password),
    []
  )

  const logout = useCallback(async () => {
    await firebase.auth().signOut()
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    await firebase.auth().sendPasswordResetEmail(email)
  }, [])

  const firebaseUpdatePassword = useCallback(async (newPassword: string) => {
    const auth = getAuth()
    await updatePassword(auth.currentUser!, newPassword)
  }, [])

  const updateProfile = useCallback(() => {}, [])

  const value = useMemo(
    () => ({
      ...appAuthState,
      logout,
      firebaseRegister,
      firebaseEmailPasswordSignIn,
      login: () => {},
      firebaseGoogleSignIn,
      firebaseTwitterSignIn,
      firebaseFacebookSignIn,
      firebaseUpdatePassword,
      resetPassword,
      updateProfile
    }),
    [
      appAuthState,
      logout,
      firebaseRegister,
      firebaseEmailPasswordSignIn,
      firebaseGoogleSignIn,
      firebaseTwitterSignIn,
      firebaseFacebookSignIn,
      firebaseUpdatePassword,
      resetPassword,
      updateProfile
    ]
  )
  if (appAuthState.isInitialized !== undefined && !appAuthState.isInitialized) {
    return <Loader />
  }
  return <FirebaseContext.Provider value={value}>{children}</FirebaseContext.Provider>
}

export default FirebaseContext

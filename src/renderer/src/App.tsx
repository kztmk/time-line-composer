import { useEffect, useState } from 'react';

import Snackbar from './components/@extended/Snackbar';
import Customization from './components/Customization';
import Loader from './components/Loader';
import ScrollTop from './components/ScrollTop';
import Notistack from './components/third-party/Notistack';

import { dispatch } from './store';
import { fetchMenu } from './store/reducers/menu';

// auth-provider
// import { JWTProvider as AuthProvider } from 'contexts/JWTContext';
import { FirebaseProvider as AuthProvider } from './contexts/FirebaseContext';
// import { AWSCognitoProvider as AuthProvider } from 'contexts/AWSCognitoContext';
// import { Auth0Provider as AuthProvider } from 'contexts/Auth0Context';

// project-imports
import Routes from './routes';
import ThemeCustomization from './themes';

// ==============================|| APP - THEME, ROUTER, LOCAL  ||============================== //

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    dispatch(fetchMenu());
    setLoading(false);
  }, []);

  if (loading) return <Loader />;

  return (
    <ThemeCustomization>
      <ScrollTop>
        <AuthProvider>
          <Notistack>
            <Routes />
            <Customization />
            <Snackbar />
          </Notistack>
        </AuthProvider>
      </ScrollTop>
    </ThemeCustomization>
  );
};

export default App;

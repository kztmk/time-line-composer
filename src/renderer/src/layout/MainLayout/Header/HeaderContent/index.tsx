import { useMemo } from 'react';

// material-ui
import { Box, useMediaQuery } from '@mui/material';
import { Theme } from '@mui/material/styles';

// project-imports
import MegaMenuSection from './MegaMenuSection';
import Message from './Message';
import MobileSection from './MobileSection';
import Notification from './Notification';
import Profile from './Profile';
import Search from './Search';

import useConfig from '../../../../hooks/useConfig';
import DrawerHeader from '../../Drawer/DrawerHeader';

// type
import { MenuOrientation } from '../../../../types/config';

// ==============================|| HEADER - CONTENT ||============================== //

const HeaderContent = () => {
  const { menuOrientation } = useConfig();

  const downLG = useMediaQuery((theme: Theme) => theme.breakpoints.down('lg'));

  const megaMenu = useMemo(() => <MegaMenuSection />, []);

  return (
    <>
      {menuOrientation === MenuOrientation.HORIZONTAL && !downLG && <DrawerHeader open />}
      {!downLG && <Search />}
      {!downLG && megaMenu}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}

      <Notification />
      <Message />
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </>
  );
};

export default HeaderContent;

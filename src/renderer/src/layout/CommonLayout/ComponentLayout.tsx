import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';

// material-ui
import { Box, useMediaQuery } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

// project-imports
import { DRAWER_WIDTH } from '../../config';
import Drawer from './Drawer';

import { dispatch } from '../../store';
import { openComponentDrawer } from '../../store/reducers/menu';

interface MainProps {
  open: boolean;
}

// components content
const Main = styled('main', {
  shouldForwardProp: (prop) => prop !== 'open',
})<MainProps>(({ theme, open }) => ({
  minHeight: `calc(100vh - 180px)`,
  width: `calc(100% - ${DRAWER_WIDTH}px)`,
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  [theme.breakpoints.down('md')]: {
    paddingLeft: 0,
  },
  ...(open && {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

// ==============================|| COMPONENTS LAYOUT ||============================== //

interface Props {
  handleDrawerOpen: () => void;
  componentDrawerOpen: boolean;
}

const ComponentsLayout = ({ handleDrawerOpen, componentDrawerOpen }: Props) => {
  const theme = useTheme();
  const matchDownMd = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    dispatch(openComponentDrawer({ componentDrawerOpen: !matchDownMd }));
  }, [matchDownMd]);

  return (
    <Box sx={{ display: 'flex', pt: componentDrawerOpen ? { xs: 0, md: 2.5 } : 0 }}>
      <Drawer handleDrawerOpen={handleDrawerOpen} open={componentDrawerOpen} />
      <Main theme={theme} open={componentDrawerOpen}>
        <Outlet />
      </Main>
    </Box>
  );
};

export default ComponentsLayout;

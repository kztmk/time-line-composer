import { ReactNode, SyntheticEvent, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  ButtonBase,
  CardContent,
  ClickAwayListener,
  Grid,
  Paper,
  Popper,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Logout, Profile, Setting2 } from 'iconsax-react';

// project-imports
import Avatar from '../../../../../components/@extended/Avatar';
import IconButton from '../../../../../components/@extended/IconButton';
import Transitions from '../../../../../components/@extended/Transitions';
import MainCard from '../../../../../components/MainCard';
import useAuth from '../../../../../hooks/useAuth';
import ProfileTab from './ProfileTab';
import SettingTab from './SettingTab';

// assets
import avatar1 from '../../../../../assets/images/users/avatar-6.png';

// types
import { ThemeMode } from '../../../../../types/config';

import { dispatch } from '../../../../../store';
import { openSnackbar } from '../../../../../store/reducers/snackbar';

// types
interface TabPanelProps {
  children?: ReactNode;
  dir?: string;
  index: number;
  value: number;
}

// tab panel wrapper
const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
      sx={{ p: 1 }}
    >
      {value === index && children}
    </Box>
  );
};

const a11yProps = (index: number) => {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
};

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const ProfilePage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { logout, user } = useAuth();
  const handleLogout = async () => {
    try {
      await logout();
      navigate(`/login`, {
        state: {
          from: '',
        },
      });
    } catch (err) {
      dispatch(
        openSnackbar({
          open: true,
          message: 'Check mail for reset password link',
          variant: 'alert',
          alert: {
            color: 'success',
          },
          close: false,
        })
      );
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anchorRef = useRef<any>(null);
  const [open, setOpen] = useState(false);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }
    setOpen(false);
  };

  const [value, setValue] = useState(0);

  const handleChange = (event: SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          borderRadius: 1,
          '&:hover': {
            bgcolor:
              theme.palette.mode === ThemeMode.DARK ? 'secondary.light' : 'secondary.lighter',
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.secondary.dark}`,
            outlineOffset: 2,
          },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Avatar alt="profile user" src={avatar1} />
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper
              sx={{
                boxShadow: theme.customShadows.z1,
                width: 290,
                minWidth: 240,
                maxWidth: 290,
                [theme.breakpoints.down('md')]: {
                  maxWidth: 250,
                },
                borderRadius: 1.5,
              }}
            >
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Grid item>
                        <Stack direction="row" spacing={1.25} alignItems="center">
                          <Avatar alt="profile user" src={avatar1} />
                          <Stack>
                            <Typography variant="subtitle1">{user?.name}</Typography>
                            <Typography variant="body2" color="secondary">
                              UI/UX Designer
                            </Typography>
                          </Stack>
                        </Stack>
                      </Grid>
                      <Grid item>
                        <Tooltip title="Logout">
                          <IconButton
                            size="large"
                            color="error"
                            sx={{ p: 1 }}
                            onClick={handleLogout}
                          >
                            <Logout variant="Bulk" />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </CardContent>

                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs
                      variant="fullWidth"
                      value={value}
                      onChange={handleChange}
                      aria-label="profile tabs"
                    >
                      <Tab
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textTransform: 'capitalize',
                        }}
                        icon={
                          <Profile size={18} style={{ marginBottom: 0, marginRight: '10px' }} />
                        }
                        label="Profile"
                        {...a11yProps(0)}
                      />
                      <Tab
                        sx={{
                          display: 'flex',
                          flexDirection: 'row',
                          justifyContent: 'center',
                          alignItems: 'center',
                          textTransform: 'capitalize',
                        }}
                        icon={
                          <Setting2 size={18} style={{ marginBottom: 0, marginRight: '10px' }} />
                        }
                        label="Setting"
                        {...a11yProps(1)}
                      />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <ProfileTab handleLogout={handleLogout} />
                  </TabPanel>
                  <TabPanel value={value} index={1} dir={theme.direction}>
                    <SettingTab />
                  </TabPanel>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default ProfilePage;

/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { SyntheticEvent, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link as RouterLink } from 'react-router-dom';
import { z } from 'zod';

// material-ui
import {
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
// assets
import { Eye, EyeSlash } from 'iconsax-react';

// project-imports
import AnimateButton from '../../../components/@extended/AnimateButton';
import IconButton from '../../../components/@extended/IconButton';
import useAuth from '../../../hooks/useAuth';

const schema = z.object({
  email: z.string().email('Must be a valid email').max(255).min(1, 'Email is required'),
  password: z.string().max(255).min(1, 'Password is required'),
});

type AuthLoginInputs = z.infer<typeof schema>;

const defaultValues: AuthLoginInputs = {
  email: '',
  password: '',
};

// ============================|| FIREBASE - LOGIN ||============================ //

const AuthLogin = ({ forgot }: { forgot: string }) => {
  const [checked, setChecked] = useState(false);
  const [capsWarning, setCapsWarning] = useState(false);

  const { isLoggedIn, firebaseEmailPasswordSignIn } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);
  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const onKeyDown = (keyEvent: React.KeyboardEvent) => {
    if (keyEvent.getModifierState('CapsLock')) {
      setCapsWarning(true);
    } else {
      setCapsWarning(false);
    }
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<AuthLoginInputs>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  // react-hook-form onSubmit
  const onSubmit = async (data: AuthLoginInputs) => {
    try {
      await firebaseEmailPasswordSignIn(data.email, data.password);
    } catch (err: any) {
      const errorMessage = err.message || 'Unexpected error occured';
      setFormErrorMessage(errorMessage);
    }
  };

  // use react-hook-form and validate data by zod
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="email-login">Email Address</InputLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <>
                  <OutlinedInput
                    {...field}
                    fullWidth
                    error={!!errors.email}
                    id="email"
                    type="email"
                    placeholder="Enter email address"
                  />
                  {errors.email && (
                    <FormHelperText error id="standard-weight-helper-text-email-login">
                      {errors.email?.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="password-login">Password</InputLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <>
                  <OutlinedInput
                    {...field}
                    fullWidth
                    color={capsWarning ? 'warning' : 'primary'}
                    error={!!errors.password}
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    onKeyDown={onKeyDown}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                          color="secondary"
                        >
                          {showPassword ? <Eye /> : <EyeSlash />}
                        </IconButton>
                      </InputAdornment>
                    }
                    placeholder="Enter password"
                  />
                  {capsWarning && (
                    <Typography
                      variant="caption"
                      sx={{ color: 'warning.main' }}
                      id="warning-helper-text-password-login"
                    >
                      Caps lock on!
                    </Typography>
                  )}
                  {errors.password && (
                    <FormHelperText error id="standard-weight-helper-text-password-login">
                      {errors.password?.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} sx={{ mt: -1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked}
                  onChange={(event) => setChecked(event.target.checked)}
                  name="checked"
                  color="primary"
                  size="small"
                />
              }
              label={<Typography variant="h6">Keep me sign in</Typography>}
            />
            <Link
              variant="h6"
              component={RouterLink}
              to={isLoggedIn && forgot ? forgot : '/forgot-password'}
              color="text.primary"
            >
              Forgot Password?
            </Link>
          </Stack>
        </Grid>
        {formErrorMessage && (
          <Grid item xs={12}>
            <FormHelperText error>{formErrorMessage}</FormHelperText>
          </Grid>
        )}
        <Grid item xs={12}>
          <AnimateButton>
            <Button
              disableElevation
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              Login
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default AuthLogin;

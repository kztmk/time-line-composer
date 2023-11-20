import { SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';
// assets
import { Eye, EyeSlash } from 'iconsax-react';
// third-party
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

// project-imports
import AnimateButton from '../../../components/@extended/AnimateButton';
import IconButton from '../../../components/@extended/IconButton';
import useAuth from '../../../hooks/useAuth';
import useScriptRef from '../../../hooks/useScriptRef';

import { dispatch } from '../../../store';
import { openSnackbar } from '../../../store/reducers/snackbar';
import { strengthColor, strengthIndicator } from '../../../utils/password-strength';

// types
import { StringColorProps } from '../../../types/password';

// ============================|| FIREBASE - RESET PASSWORD ||============================ //

const schema = z
  .object({
    password: z.string().max(255).min(8, 'Password is required'),
    confirmPassword: z.string().min(8, 'Confirm Password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type AuthResetPasswordFormValues = z.infer<typeof schema>;

const defaultValue: AuthResetPasswordFormValues = {
  password: '',
  confirmPassword: '',
};

const AuthResetPassword = () => {
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

  const { isLoggedIn, firebaseUpdatePassword } = useAuth();

  const [level, setLevel] = useState<StringColorProps>();
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  const handleMouseDownPassword = (event: SyntheticEvent) => {
    event.preventDefault();
  };

  const changePassword = (value: string) => {
    const temp = strengthIndicator(value);
    setLevel(strengthColor(temp));
  };

  useEffect(() => {
    changePassword('');
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AuthResetPasswordFormValues>({
    defaultValues: defaultValue,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: AuthResetPasswordFormValues) => {
    try {
      // password reset
      await firebaseUpdatePassword(values.password);
      if (scriptedRef.current) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Successfuly reset password.',
            variant: 'alert',
            alert: {
              color: 'success',
            },
            close: false,
          })
        );

        setTimeout(() => {
          navigate(isLoggedIn ? '/auth/login' : '/login', { replace: true });
        }, 1500);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong';
      setFormErrorMessage(errorMessage);
    }
  };

  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="password-reset">Password</InputLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  {...field}
                  fullWidth
                  error={!!errors.password}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    changePassword(e.target.value);
                  }}
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
              )}
            />
            {!!errors.password && (
              <FormHelperText error id="helper-text-password-reset">
                {errors.password.message}
              </FormHelperText>
            )}
          </Stack>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Box sx={{ bgcolor: level?.color, width: 85, height: 8, borderRadius: '7px' }} />
              </Grid>
              <Grid item>
                <Typography variant="subtitle1" fontSize="0.75rem">
                  {level?.label}
                </Typography>
              </Grid>
            </Grid>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="confirm-password-reset">Confirm Password</InputLabel>
            <Controller
              name="confirmPassword"
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  {...field}
                  fullWidth
                  error={!!errors.confirmPassword}
                  id="confirmPassword"
                  type="password"
                  {...field}
                  placeholder="Enter confirm password"
                />
              )}
            />
            {!!errors.confirmPassword && (
              <FormHelperText error id="helper-text-confirm-password-reset">
                {errors.confirmPassword.message}
              </FormHelperText>
            )}
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
              disabled={isSubmitting}
              fullWidth
              size="large"
              type="submit"
              variant="contained"
              color="primary"
            >
              Reset Password
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default AuthResetPassword;

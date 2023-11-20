import { SyntheticEvent, useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

// material-ui
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputAdornment,
  InputLabel,
  Link,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';

// third-party
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';
// assets
import { Eye, EyeSlash } from 'iconsax-react';
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

// ============================|| JWT - REGISTER ||============================ //

const schema = z.object({
  firstname: z.string().max(255).min(1, 'First Name is required'),
  lastname: z.string().max(255).min(1, 'Last Name is required'),
  email: z
    .string()
    .max(255)
    .min(1, { message: 'Email is required' })
    .email('Must be a valid email'),
  password: z.string().max(255).min(8, { message: 'Password is required' }),
});

type FormValues = z.infer<typeof schema>;

const defaultValue: FormValues = {
  firstname: '',
  lastname: '',
  email: '',
  password: '',
};

const AuthRegister = () => {
  const { firebaseRegister } = useAuth();
  const scriptedRef = useScriptRef();
  const navigate = useNavigate();

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
    register: formRegister,
    formState: { errors, touchedFields },
  } = useForm<FormValues>({
    defaultValues: defaultValue,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values: FormValues) => {
    try {
      await firebaseRegister(values.email, values.password);
      if (scriptedRef.current) {
        dispatch(
          openSnackbar({
            open: true,
            message: 'Your registration has been successfully completed.',
            variant: 'alert',
            alert: {
              color: 'success',
            },
            close: false,
          })
        );

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 1500);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const message = err.message || 'Something went wrong';
      setFormErrorMessage(message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <InputLabel htmlFor="firstname-signup">First Name*</InputLabel>
            <Controller
              name="firstname"
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  {...field}
                  fullWidth
                  error={!!errors.firstname}
                  id="firstname"
                  type="firstname"
                  placeholder="John"
                  inputProps={field}
                />
              )}
            />
            {!!errors.firstname && (
              <FormHelperText error id="helper-text-firstname-signup">
                {errors.firstname.message}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <InputLabel htmlFor="lastname-signup">Last Name*</InputLabel>
            <Controller
              name="lastname"
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  {...field}
                  fullWidth
                  error={!!errors.lastname}
                  id="lastname"
                  type="lastname"
                  placeholder="Doe"
                  inputProps={field}
                />
              )}
            />
            {!!errors.lastname && (
              <FormHelperText error id="helper-text-lastname-signup">
                {errors.lastname.message}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="email-signup">Email Address*</InputLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  {...field}
                  fullWidth
                  error={!!errors.email}
                  id="email"
                  type="email"
                  placeholder=""
                />
              )}
            />
            {!!errors.email && (
              <FormHelperText error id="helper-text-email-signup">
                {errors.email.message}
              </FormHelperText>
            )}
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="password-signup">Password</InputLabel>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <OutlinedInput
                  {...field}
                  fullWidth
                  error={Boolean(touchedFields.password && errors.password)}
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...formRegister('password')}
                  onChange={(e) => {
                    changePassword(e.target.value);
                    field.onChange(e);
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
                  placeholder="******"
                  inputProps={{}}
                />
              )}
            />
            {!!errors.password && (
              <FormHelperText error id="helper-text-password-signup">
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
          <Typography variant="body2">
            By Signing up, you agree to our &nbsp;
            <Link variant="subtitle2" component={RouterLink} to="/tos">
              Terms of Service
            </Link>
            &nbsp; and &nbsp;
            <Link variant="subtitle2" component={RouterLink} to="/policy">
              Privacy Policy
            </Link>
          </Typography>
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
              Create Account
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default AuthRegister;

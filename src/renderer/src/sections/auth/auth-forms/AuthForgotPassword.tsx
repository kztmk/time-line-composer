/* eslint-disable @typescript-eslint/no-explicit-any */
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

// material-ui
import {
  Button,
  FormHelperText,
  Grid,
  InputLabel,
  OutlinedInput,
  Stack,
  Typography,
} from '@mui/material';

// project-imports
import AnimateButton from '../../../components/@extended/AnimateButton';
import useAuth from '../../../hooks/useAuth';
import { dispatch } from '../../../store';
import { openSnackbar } from '../../../store/reducers/snackbar';
// ============================|| FIREBASE - FORGOT PASSWORD ||============================ //

const schema = z.object({
  email: z
    .string()
    .email('有効なメールアドレスを入力してください。')
    .max(255)
    .min(1, 'メールアドレスは必須です。'),
});

type ResetPasswordInputs = z.infer<typeof schema>;

const defaultValues: ResetPasswordInputs = {
  email: '',
};

const AuthForgotPassword = () => {
  const { resetPassword } = useAuth();

  const [formErrorMessage, setFormErrorMessage] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInputs>({
    defaultValues,
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: ResetPasswordInputs) => {
    try {
      await resetPassword(data.email);
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
    } catch (err: any) {
      const errorMessage = err.message || 'Something went wrong';
      setFormErrorMessage(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <InputLabel htmlFor="email-forgot">Email Address</InputLabel>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <>
                  <OutlinedInput
                    {...field}
                    fullWidth
                    error={!!errors.email}
                    type="email"
                    placeholder="Enter email address"
                  />
                  {!!errors.email && (
                    <FormHelperText error id="helper-text-email-forgot">
                      {errors.email?.message}
                    </FormHelperText>
                  )}
                </>
              )}
            />
          </Stack>
        </Grid>
        <Grid item xs={12} sx={{ mb: -2 }}>
          <Typography variant="caption">Do not forgot to check SPAM box.</Typography>
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
              Send Password Reset Email
            </Button>
          </AnimateButton>
        </Grid>
      </Grid>
    </form>
  );
};

export default AuthForgotPassword;

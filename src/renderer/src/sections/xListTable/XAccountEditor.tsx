import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

// material-ui
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Stack,
  TextField,
} from '@mui/material';

// assets
import { useEffect, useState } from 'react';
import Loader from '../../components/Loader';
import MainCard from '../../components/MainCard';
import { useDispatch, useSelector } from '../../store';
import {
  addXAccount,
  resetProcess,
  selectXAccountList,
  updateXAccount,
} from '../../store/reducers/xAccountSlice';
import { XAccountData } from '../../types/app';

// validation schema
const schema = z.object({
  id: z.string(),
  userName: z.string().startsWith('@', { message: 'ユーザー名は@から始まる必要があります' }),
  displayName: z
    .string()
    .min(1, { message: '表示名はアカウントを区別するためにXで使用してる名前にしてください。' }),
  loginProvider: z.enum(['Google', 'Apple', 'メールアドレス', '電話番号', 'ユーザー名'], {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    errorMap: (issue, ctx) => ({ message: 'ログイン方法を指定してください。' }),
  }),
  loginProviderId: z
    .string()
    .min(5, { message: 'ログイン方法に応じたログインIDを入力してください。' }),
  loginProviderPassword: z
    .string()
    .min(5, { message: 'ログイン方法に応じたパスワードを入力してください。' }),
  remark: z.string().min(1).or(z.literal('')),
});

export type XAccoutEditorDataType = z.infer<typeof schema>;

export const xAccountDefaultValue: XAccoutEditorDataType = {
  id: '',
  userName: '',
  displayName: '',
  loginProvider: 'Google',
  loginProviderId: '',
  loginProviderPassword: '',
  remark: '',
};

// ==============================|| FORMS VALIDATION - ADDRESS ||============================== //
const loginProviders = [
  { label: 'Google', value: 'Google' },
  { label: 'Apple', value: 'Apple' },
  { label: 'メールアドレス', value: 'メールアドレス' },
  { label: '電話番号', value: '電話番号' },
  { label: 'ユーザー名', value: 'ユーザー名' },
];

type XAccountEditorProps = {
  closeDialog: () => void;
  accountData: XAccoutEditorDataType;
};

const XAccountEditor: React.FC<XAccountEditorProps> = (props) => {
  // const theme = useTheme();
  const [loginProviderLabel, setLoginProviderLabel] = useState<{
    label: 'Google' | 'Apple' | 'メールアドレス' | '電話番号' | 'ユーザー名';
    value: 'Google' | 'Apple' | 'メールアドレス' | '電話番号' | 'ユーザー名';
  }>({ label: 'Google', value: 'Google' });

  // error dialog
  const [openDialog, setOpenDialog] = useState(false);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const { closeDialog, accountData } = props;
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: xAccountDefaultValue,
    resolver: zodResolver(schema),
  });

  const dispatch = useDispatch();
  const { process, isError, errorMessage, isLoading } = useSelector(selectXAccountList);

  useEffect(() => {
    if (accountData.id !== xAccountDefaultValue.id) {
      setValue('id', accountData.id);
      setValue('userName', accountData.userName);
      setValue('displayName', accountData.displayName);
      setValue('loginProvider', accountData.loginProvider);
      setValue('loginProviderId', accountData.loginProviderId);
      setValue('loginProviderPassword', accountData.loginProviderPassword);
      setValue('remark', accountData.remark);
      setLoginProviderLabel({ label: accountData.loginProvider, value: accountData.loginProvider });
    }
  }, [accountData, setValue]);

  const onReset = () => {
    reset(xAccountDefaultValue);
    setLoginProviderLabel({ label: 'Google', value: 'Google' });
  };

  const onSubmit = async (data: XAccoutEditorDataType) => {
    const saveData: XAccountData = {
      id: data.id,
      userName: data.userName,
      displayName: data.displayName,
      loginProvider: data.loginProvider,
      loginProviderId: data.loginProviderId,
      loginProviderPassword: data.loginProviderPassword,
      remark: data.remark,
    };
    if (saveData.id === xAccountDefaultValue.id) {
      // 新規追加
      await dispatch(addXAccount(saveData));
    } else {
      // 更新
      await dispatch(updateXAccount(saveData));
    }
  };

  // dispatch result
  useEffect(() => {
    if (!isLoading && isError) {
      // error
      setOpenDialog(true);
    }
    if (!isLoading && !isError && process === 'addNew') {
      // success
      dispatch(resetProcess());
      closeDialog();
    }
    if (!isLoading && !isError && process === 'update') {
      // update success
      // show dialog
      dispatch(resetProcess());
      closeDialog();
    }
  }, [isLoading, isError, errorMessage, closeDialog, process, dispatch]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <MainCard title="Xアカウント新規追加・更新">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3.5}>
          <Grid item xs={12}>
            <Controller
              name="userName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="userName"
                  label="ユーザー名"
                  error={!!errors.userName}
                  helperText={errors.userName && errors.userName.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="displayName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="displayName"
                  label="表示名"
                  error={!!errors.displayName}
                  helperText={errors.displayName && errors.displayName.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <Controller
              control={control}
              name="loginProvider"
              render={({ field: { ref, onChange, ...field } }) => (
                <Autocomplete
                  id="loginProvider"
                  options={loginProviders}
                  getOptionLabel={(option) => option.label}
                  onChange={(_, data) => onChange(data?.value)}
                  value={loginProviderLabel}
                  renderInput={(params) => (
                    <TextField
                      {...field}
                      inputRef={ref}
                      {...params}
                      InputLabelProps={{ shrink: true }}
                      label="ログイン方法"
                      fullWidth
                    />
                  )}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="loginProviderId"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="loginProviderId"
                  label="ログインID"
                  error={!!errors.loginProviderId}
                  helperText={errors.loginProviderId && errors.loginProviderId.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="loginProviderPassword"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  id="loginProviderPassword"
                  label="パスワード"
                  error={!!errors.loginProviderPassword}
                  helperText={errors.loginProviderPassword && errors.loginProviderPassword.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Controller
              name="remark"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  multiline
                  id="remark"
                  label="備考"
                  error={!!errors.remark}
                  helperText={errors.remark && errors.remark.message}
                />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={2}>
              <Button variant="contained" type="button" onClick={closeDialog} color="warning">
                キャンセル
              </Button>
              <Button variant="contained" type="button" onClick={onReset} color="secondary">
                リセット
              </Button>
              <Button variant="contained" type="submit">
                保存
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </form>
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <Box sx={{ p: 1, py: 1.5 }}>
          <DialogTitle id="alert-dialog-title">エラー</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">{errorMessage}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleCloseDialog} autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Box>
      </Dialog>
    </MainCard>
  );
};

export default XAccountEditor;

// material-ui
import {
  Button,
  ButtonProps,
  CardMedia,
  Chip,
  ChipProps,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import Dot from '../../@extended/Dot';

// project-imports
import MainCard from '../../MainCard';

// ==============================|| HEADER - MESSAGE CARD ||============================== //

interface MessageActions {
  label: string;
  button: ButtonProps;
}

interface MessageCardProps {
  status: ChipProps;
  time: string;
  title: string;
  message: string;
  src: string;
  actions?: MessageActions[];
}

const MessageCard = ({ status, time, title, message, src, actions }: MessageCardProps) => {
  return (
    <MainCard>
      <Grid container spacing={1.5}>
        <Grid item xs={12}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Chip label={status.label} color={status.color} size="small" variant="light" />
            <Typography variant="caption" color="secondary">
              {time}
            </Typography>
            <Dot size={5} color="warning" />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="subtitle1">{title}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography>{message}</Typography>
        </Grid>
        <Grid item xs={12}>
          <CardMedia component="img" src={src} alt={title} />
        </Grid>
        {actions && actions?.length > 0 && (
          <Grid item xs={12} sx={{ mt: 1 }}>
            <Stack direction="row" alignItems="center" spacing={{ xs: 1.5, sm: 2.5 }}>
              {actions.map((item: MessageActions) => (
                <Button {...item.button} key={uuidv4()}>
                  {item.label}
                </Button>
              ))}
            </Stack>
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
};

export default MessageCard;

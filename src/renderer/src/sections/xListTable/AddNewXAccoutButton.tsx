import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import { AddSquare } from 'iconsax-react';

interface Props {
  onClick: () => void;
}

const AddNewXAccountButton: React.FC<Props> = ({ onClick }) => {
  return (
    <IconButton
      onClick={onClick}
      size="large"
      sx={{ paddingInline: 0, width: '42x', height: '42px', padding: 0 }}
    >
      <Tooltip title="Add new X account">
        <AddSquare size={42} style={{ color: 'gray' }} />
      </Tooltip>
    </IconButton>
  );
};

export default AddNewXAccountButton;

import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';

import XAccountEditor, { XAccoutEditorDataType } from './XAccountEditor';

type DialogXAccountFormProps = {
  open: boolean;
  onClose: () => void;
  accountData: XAccoutEditorDataType;
};

const DialogXAccountForm = ({ open, onClose, accountData }: DialogXAccountFormProps) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent>
        <XAccountEditor closeDialog={onClose} accountData={accountData} />
      </DialogContent>
    </Dialog>
  );
};

export default DialogXAccountForm;

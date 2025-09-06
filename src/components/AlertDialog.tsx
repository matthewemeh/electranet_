import { forwardRef } from 'react';
import type { TransitionProps } from '@mui/material/transitions';
import {
  Slide,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

const Transition = forwardRef(
  (
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>
  ) => {
    return <Slide direction='up' ref={ref} {...props} />;
  }
);

interface Props {
  open: boolean;
  dialogTitle: string;
  onClose?: () => void;
  keepMounted?: boolean;
  negationText?: string;
  onNegated?: () => void;
  onAffirmed?: () => void;
  affirmativeText?: string;
  affirmationOnly?: boolean;
  dialogContent: React.ReactNode;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const AlertDialog: React.FC<Props> = ({
  open,
  setOpen,
  onClose,
  onNegated,
  onAffirmed,
  keepMounted,
  dialogTitle,
  dialogContent,
  affirmationOnly,
  negationText = 'No',
  affirmativeText = 'Yes',
}) => {
  const handleClose = () => {
    setOpen(false);
    onClose?.();
  };

  const handleAffirmation = () => {
    setOpen(false);
    onAffirmed?.();
  };

  const handleNegation = () => {
    setOpen(false);
    onNegated?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      keepMounted={keepMounted}
      slots={{ transition: Transition }}
      aria-describedby='alert-dialog-slide-description'
    >
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent>
        <DialogContentText component='div' id='alert-dialog-slide-description'>
          {dialogContent}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        {affirmationOnly || <Button onClick={handleNegation}>{negationText}</Button>}
        <Button variant='contained' onClick={handleAffirmation}>
          {affirmativeText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlertDialog;

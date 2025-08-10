import IconButton from '@mui/material/IconButton';
import { KeyboardBackspaceRounded } from '@mui/icons-material';

interface Props {
  disabled?: boolean;
  onClick?: () => void;
}

const BackButton: React.FC<Props> = ({ disabled, onClick }) => {
  return (
    <IconButton
      aria-label='back'
      onClick={onClick}
      disabled={disabled}
      className='w-10 h-10 !absolute -left-2 -top-10 sm:-left-16 sm:top-2'>
      <KeyboardBackspaceRounded />
    </IconButton>
  );
};

export default BackButton;

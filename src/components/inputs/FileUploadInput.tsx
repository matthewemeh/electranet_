import { forwardRef } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { CloudUpload } from '@mui/icons-material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

interface Props {
  inputID?: string;
  accept?: string;
  inputName?: string;
  buttonText: string;
  multiple?: boolean;
  value?: string | number | readonly string[];
  variant?: 'text' | 'outlined' | 'contained';
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
}

// Forward ref to internal <input />
const FileUploadInput = forwardRef<HTMLInputElement, Props>(
  ({ value, onBlur, accept, variant, inputID, multiple, onChange, inputName, buttonText }, ref) => {
    return (
      <Button component='label' variant={variant} startIcon={<CloudUpload />}>
        {buttonText}
        <VisuallyHiddenInput
          ref={ref}
          type='file'
          id={inputID}
          value={value}
          onBlur={onBlur}
          accept={accept}
          name={inputName}
          multiple={multiple}
          onChange={onChange}
        />
      </Button>
    );
  }
);

export default FileUploadInput;

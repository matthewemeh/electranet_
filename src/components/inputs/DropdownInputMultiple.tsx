import { useState } from 'react';
import {
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  type SelectChangeEvent,
} from '@mui/material';

interface Props {
  id?: string;
  name?: string;
  label: string;
  error?: boolean;
  labelID?: string;
  value?: string[];
  required?: boolean;
  disabled?: boolean;
  menuItems: ListItem[];
  helperText?: React.ReactNode;
  defaultValue?: string | string[];
  onItemChange?: (listItem?: ListItem[]) => void;
  onChange?: (event: SelectChangeEvent<string[]>) => void;
  onBlur?: React.FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
}

const DropdownInput: React.FC<Props> = ({
  id,
  name,
  label,
  error,
  value,
  onBlur,
  labelID,
  disabled,
  onChange,
  required,
  menuItems,
  helperText,
  onItemChange,
  defaultValue,
}) => {
  const [selectedItems, setSelectedItems] = useState<ListItem[]>(
    typeof defaultValue === 'string'
      ? menuItems.filter(({ value }) => defaultValue === value)
      : menuItems.filter(({ value }) => defaultValue?.includes(value))
  );

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const { value } = event.target;

    const selectedItems = typeof value === 'string' ? value.split(',') : value;

    const newSelectedItems = menuItems.filter(({ value }) => selectedItems.includes(value));
    setSelectedItems(newSelectedItems);
    onChange?.(event);
    onItemChange?.(newSelectedItems);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth required={required} disabled={disabled} error={error}>
        <InputLabel>{label}</InputLabel>
        <Select
          id={id}
          multiple
          name={name}
          label={label}
          onBlur={onBlur}
          labelId={labelID}
          onChange={handleChange as any}
          value={value ?? selectedItems.map(item => item.value)}
          defaultValue={typeof defaultValue === 'string' ? [defaultValue] : defaultValue}
        >
          {menuItems.map(({ name, value }) => (
            <MenuItem key={value} value={value}>
              {name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{helperText}</FormHelperText>
      </FormControl>
    </Box>
  );
};

export default DropdownInput;

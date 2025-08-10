import { useRef, useState } from 'react';
import { TextField, type SelectChangeEvent } from '@mui/material';

import constants from '../../constants';
import AlertDialog from '../AlertDialog';
import DropdownInput from '../inputs/DropdownInput';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<GetUsersPayload['params']>>;
}

const UserFilters: React.FC<Props> = ({ setFilters, open, setOpen }) => {
  const { ROLES } = constants;

  const formRef = useRef<HTMLFormElement>(null);
  const [newFilters, setNewFilters] = useState<GetUsersPayload['params']>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.currentTarget;

    if (!value.length) {
      setNewFilters(prev => {
        const oldFilters = { ...prev };
        //@ts-ignore
        delete oldFilters[name];

        return oldFilters;
      });
      return;
    }

    setNewFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setNewFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleNegation = () => {
    formRef.current?.reset();
    setFilters({});
    setNewFilters({});
  };

  return (
    <AlertDialog
      open={open}
      setOpen={setOpen}
      negationText='Clear'
      affirmativeText='Confirm'
      dialogTitle='User Filters'
      onNegated={handleNegation}
      onAffirmed={() => setFilters(newFilters)}
      dialogContent={
        <form ref={formRef} className='form mt-4 !mb-0'>
          <TextField
            type='text'
            id='lastName'
            name='lastName'
            label='Last Name'
            className='form-field'
            onChange={handleChange}
            value={newFilters?.lastName || ''}
          />

          <TextField
            type='text'
            id='firstName'
            name='firstName'
            label='First Name'
            className='form-field'
            onChange={handleChange}
            value={newFilters?.firstName || ''}
          />

          <TextField
            type='text'
            id='email'
            name='email'
            label='Email'
            className='form-field'
            onChange={handleChange}
            value={newFilters?.email || ''}
          />

          <DropdownInput
            id='role'
            name='role'
            label='Role'
            onChange={handleSelectChange}
            value={newFilters?.role || ''}
            menuItems={Object.entries(ROLES)
              .filter(([_, value]) => value !== 'SUPER_ADMIN')
              .map(([key, value]) => ({
                value,
                name: key.replaceAll('_', ' '),
              }))}
          />
        </form>
      }
    />
  );
};

export default UserFilters;

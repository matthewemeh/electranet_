import { useRef, useState } from 'react';
import { FormControlLabel, Switch, TextField, type SelectChangeEvent } from '@mui/material';

import constants from '../../constants';
import AlertDialog from '../AlertDialog';
import DropdownInput from '../inputs/DropdownInput';
import { useGetPartiesQuery } from '../../services/apis/partyApi';
import { useHandleReduxQueryError } from '../../hooks/useHandleReduxQuery';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<GetContestantsPayload['params']>>;
}

const ContestantFilters: React.FC<Props> = ({ open, setOpen, setFilters }) => {
  const { GENDERS } = constants;

  const formRef = useRef<HTMLFormElement>(null);
  const [newFilters, setNewFilters] = useState<GetContestantsPayload['params']>({});

  const {
    data: partiesData,
    error: getPartiesError,
    refetch: refetchParties,
    isError: isGetPartiesError,
  } = useGetPartiesQuery({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.currentTarget;

    if (type !== 'checkbox' && !value.length) {
      setNewFilters(prev => {
        const oldFilters = { ...prev };
        //@ts-ignore
        delete oldFilters[name];

        return oldFilters;
      });
      return;
    }

    setNewFilters(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
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

  useHandleReduxQueryError({
    error: getPartiesError,
    refetch: refetchParties,
    isError: isGetPartiesError,
  });

  return (
    <AlertDialog
      open={open}
      setOpen={setOpen}
      negationText='Clear'
      affirmativeText='Confirm'
      onNegated={handleNegation}
      dialogTitle='Contestant Filters'
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

          <DropdownInput
            id='gender'
            name='gender'
            label='Gender'
            onChange={handleSelectChange}
            value={newFilters?.gender || ''}
            menuItems={Object.values(GENDERS).map(value => ({
              value,
              name: `${value[0]}${value.slice(1).toLowerCase()}`,
            }))}
          />

          {partiesData && Array.isArray(partiesData.data) && (
            <DropdownInput
              id='party'
              name='party'
              label='Party'
              onChange={handleSelectChange}
              value={newFilters?.party || ''}
              menuItems={partiesData.data.map(({ logoUrl, shortName, longName, _id }) => ({
                value: _id,
                name: (
                  <span className='party'>
                    <img src={logoUrl} alt={longName} className='party__img' />
                    <span>{shortName}</span>
                  </span>
                ),
              }))}
            />
          )}

          <FormControlLabel
            label='Deleted'
            className='!w-fit'
            control={
              <Switch
                name='isDeleted'
                onChange={handleChange}
                checked={newFilters?.isDeleted ?? false}
              />
            }
          />
        </form>
      }
    />
  );
};

export default ContestantFilters;

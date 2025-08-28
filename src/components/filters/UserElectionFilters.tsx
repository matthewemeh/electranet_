import moment from 'moment';
import { useState } from 'react';
import { TextField } from '@mui/material';

import AlertDialog from '../AlertDialog';
import DatePicker from '../inputs/DatePicker';

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFilters: React.Dispatch<React.SetStateAction<GetUserElectionsPayload['params']>>;
}

const UserElectionFilters: React.FC<Props> = ({ setFilters, open, setOpen }) => {
  const [toDate, setToDate] = useState<Date>();
  const [fromDate, setFromDate] = useState<Date>();
  const [toDatePickerVisible, setToDatePickerVisible] = useState(false);
  const [fromDatePickerVisible, setFromDatePickerVisible] = useState(false);
  const [newFilters, setNewFilters] = useState<GetUserElectionsPayload['params']>({});

  const handleNegation = () => {
    setFilters({});
    setNewFilters({});
    setToDate(undefined);
    setFromDate(undefined);
  };

  return (
    <AlertDialog
      open={open}
      setOpen={setOpen}
      negationText='Clear'
      affirmativeText='Confirm'
      dialogTitle='Election Filters'
      onNegated={handleNegation}
      onAffirmed={() => setFilters(newFilters)}
      dialogContent={
        <form className='form mt-4 !mb-0'>
          <TextField
            type='text'
            id='fromDate'
            name='fromDate'
            label='From Date'
            autoComplete='off'
            onClick={() => setFromDatePickerVisible(true)}
            value={fromDate ? moment(fromDate).format('ll') : ''}
          />
          <DatePicker
            selectedDate={fromDate}
            setSelectedDate={setFromDate}
            visible={fromDatePickerVisible}
            setVisible={setFromDatePickerVisible}
            onDateChange={date =>
              setNewFilters(prev => ({ ...prev, startTime: date.toISOString() }))
            }
          />

          <TextField
            type='text'
            id='toDate'
            name='toDate'
            label='To Date'
            autoComplete='off'
            onClick={() => setToDatePickerVisible(true)}
            value={toDate ? moment(toDate).format('ll') : ''}
          />
          <DatePicker
            selectedDate={toDate}
            setSelectedDate={setToDate}
            visible={toDatePickerVisible}
            setVisible={setToDatePickerVisible}
            onDateChange={date => setNewFilters(prev => ({ ...prev, endTime: date.toISOString() }))}
          />
        </form>
      }
    />
  );
};

export default UserElectionFilters;

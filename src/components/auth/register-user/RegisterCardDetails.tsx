import moment from 'moment';
import { Formik } from 'formik';
import { string, object } from 'yup';
import { Link } from 'react-router-dom';
import { Button, TextField } from '@mui/material';
import { useContext, useMemo, useState } from 'react';

import DatePicker from '../../inputs/DatePicker';
import { PATHS } from '../../../routes/PathConstants';
import { RegisterContext } from '../../../pages/auth/register/RegisterUser';

const RegisterCardDetails = () => {
  const { LOGIN } = PATHS.AUTH;
  const todayDate = useMemo(() => new Date(), []);
  const [birthDate, setBirthDate] = useState<Date>();
  const [birthDatePickerVisible, setBirthDatePickerVisible] = useState(false);
  const { registerPayload, navigatePasswordSection } = useContext(RegisterContext)!;

  return (
    <Formik
      initialValues={registerPayload.current}
      validationSchema={object({
        vin: string().trim().required('Please enter your VIN'),
        address: string().trim().required('Please enter your address'),
        occupation: string().trim().required('Please enter your occupation'),
        delimitationCode: string().trim().required('Please enter your delimitation code'),
      })}
      onSubmit={(values, { setSubmitting }) => {
        values.dateOfBirth = moment(birthDate).format('DD-MM-YYYY');
        registerPayload.current = Object.assign(registerPayload.current, values);
        setSubmitting(false);
        navigatePasswordSection();
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form className='form' onSubmit={handleSubmit}>
          <TextField
            required
            autoFocus
            id='vin'
            type='vin'
            name='vin'
            label='VIN'
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.vin}
            error={touched.vin && !!errors.vin}
            helperText={touched.vin && errors.vin}
            className='form-field'
          />

          <TextField
            required
            type='text'
            id='address'
            name='address'
            label='Address'
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.address}
            error={touched.address && !!errors.address}
            helperText={touched.address && errors.address}
            className='form-field'
          />

          <TextField
            required
            type='text'
            id='occupation'
            name='occupation'
            label='Occupation'
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.occupation}
            error={touched.occupation && !!errors.occupation}
            helperText={touched.occupation && errors.occupation}
          />

          <TextField
            required
            type='text'
            id='dateOfBirth'
            name='dateOfBirth'
            autoComplete='off'
            label='Date of Birth'
            onClick={() => setBirthDatePickerVisible(true)}
            value={birthDate ? moment(birthDate).format('DD-MM-YYYY') : ''}
          />
          <DatePicker
            maxDate={todayDate}
            selectedDate={birthDate}
            setSelectedDate={setBirthDate}
            visible={birthDatePickerVisible}
            setVisible={setBirthDatePickerVisible}
          />

          <TextField
            required
            type='text'
            id='delimitationCode'
            name='delimitationCode'
            label='Delimitation Code'
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.delimitationCode}
            error={touched.delimitationCode && !!errors.delimitationCode}
            helperText={touched.delimitationCode && errors.delimitationCode}
          />

          <Button type='submit' variant='contained' loading={isSubmitting} className='!mt-3'>
            Continue
          </Button>

          <p className='text-center text-gull-gray font-medium text-base -tracking-[0.5%]'>
            Already have an account?&nbsp;
            <Link to={LOGIN} className='text-primary-700'>
              Login
            </Link>
          </p>
        </form>
      )}
    </Formik>
  );
};

export default RegisterCardDetails;

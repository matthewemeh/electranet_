import { Formik } from 'formik';
import { useContext } from 'react';
import { string, object } from 'yup';
import { Link } from 'react-router-dom';
import { Button, TextField } from '@mui/material';

import constants from '../../../constants';
import { PATHS } from '../../../routes/PathConstants';
import DropdownInput from '../../inputs/DropdownInput';
import { RegisterContext } from '../../../pages/auth/register/RegisterAdmin';

const RegisterDetails = () => {
  const { ROLES } = constants;
  const { LOGIN } = PATHS.AUTH;
  const { registerPayload, navigatePasswordSection } = useContext(RegisterContext)!;
  const { email, lastName, firstName, role, middleName } = registerPayload.current;

  return (
    <Formik
      initialValues={{ email, lastName, firstName, role, middleName }}
      validationSchema={object({
        email: string()
          .trim()
          .email('Please enter a valid email')
          .required('Please enter your email'),
        lastName: string()
          .trim()
          .min(2, 'Last name must be at least 2 characters')
          .max(64, 'Last name must be at most 64 characters')
          .required('Please enter your last name'),
        otherNames: string()
          .trim()
          .min(2, 'Other names must be at least 2 characters')
          .max(128, 'Other names must be at most 128 characters')
          .required('Please enter your first name'),
        role: string().oneOf(Object.values(ROLES), 'Role must be ADMIN or SUPER_ADMIN').required(),
      })}
      onSubmit={(values, { setSubmitting }) => {
        registerPayload.current = Object.assign(registerPayload.current, values);
        setSubmitting(false);
        navigatePasswordSection();
      }}
    >
      {({ values, errors, touched, handleChange, handleBlur, handleSubmit, isSubmitting }) => (
        <form className='form' onSubmit={handleSubmit}>
          <TextField
            required
            type='text'
            id='lastName'
            name='lastName'
            label='Last name'
            onBlur={handleBlur}
            onChange={handleChange}
            autoComplete='family-name'
            value={values.lastName}
            helperText={touched.lastName && errors.lastName}
            error={touched.lastName && Boolean(errors.lastName)}
            className='form-field'
          />

          <TextField
            required
            type='text'
            id='firstName'
            name='firstName'
            label='First name'
            onBlur={handleBlur}
            onChange={handleChange}
            autoComplete='given-name'
            value={values.firstName}
            helperText={touched.firstName && errors.firstName}
            error={touched.firstName && Boolean(errors.firstName)}
          />

          <TextField
            type='text'
            id='middleName'
            name='middleName'
            label='Middle name'
            onBlur={handleBlur}
            onChange={handleChange}
            autoComplete='given-name'
            value={values.middleName}
            helperText={touched.middleName && errors.middleName}
            error={touched.middleName && Boolean(errors.middleName)}
          />

          <TextField
            required
            id='email'
            type='email'
            name='email'
            label='Email'
            onBlur={handleBlur}
            onChange={handleChange}
            autoComplete='email'
            value={values.email}
            helperText={touched.email && errors.email}
            error={touched.email && Boolean(errors.email)}
            className='form-field'
          />

          <DropdownInput
            required
            id='role'
            name='role'
            onBlur={handleBlur}
            onChange={handleChange}
            value={values.role}
            defaultValue={role}
            label='Role'
            helperText={touched.role && errors.role}
            error={touched.role && Boolean(errors.role)}
            menuItems={Object.entries(ROLES)
              .filter(([_, value]) => value !== 'USER')
              .map(([key, value]) => ({
                value,
                name: key.replaceAll('_', ' '),
              }))}
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

export default RegisterDetails;

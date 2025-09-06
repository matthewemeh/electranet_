import moment from 'moment';
import { Formik } from 'formik';
import { object, string } from 'yup';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import { Button, TextField } from '@mui/material';

import constants from '../../constants';
import { AlertDialog } from '../../components';
import { PATHS } from '../../routes/PathConstants';
import { useVerifyVoteMutation } from '../../services/apis/voteApi';
import {
  useHandleReduxQueryError,
  useHandleReduxQuerySuccess,
} from '../../hooks/useHandleReduxQuery';

const VerifyVote = () => {
  const { REGEX_RULES } = constants;
  const [alertOpen, setAlertOpen] = useState(false);
  const [voteData, setVoteData] = useState<VerifyVoteResponse['data']>();
  const [verifyVote, { error, isError, isLoading, isSuccess, data, originalArgs }] =
    useVerifyVoteMutation();

  const handleVerifySuccess = (voteInfo: VerifyVoteResponse['data']) => {
    setVoteData(voteInfo);
    setAlertOpen(true);
  };

  const dialogContent: React.ReactNode = useMemo(() => {
    if (!voteData) return <></>;

    const { election, message, status, voteTimestamp } = voteData;

    return (
      <div className='grid grid-cols-[40%_60%] gap-2'>
        <p className='card-info__tag'>Election Name</p>
        <p className='card-info__text capitalize'>{election.name}</p>

        <p className='card-info__tag'>Election Delimitation Code</p>
        <p className='card-info__text'>{election.delimitationCode}</p>

        <p className='card-info__tag'>Vote Status</p>
        <p
          className={`card-info__text capitalize p-2 rounded-sm w-fit flex items-center gap-2 ${
            status === 'success' ? 'text-green-600 bg-green-200' : 'text-red-600 bg-red-200'
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
          />
          {status}
        </p>

        <p className='card-info__tag'>Message</p>
        <p className='card-info__text'>{message}</p>

        <p className='card-info__tag'>Timestamp</p>
        <p className='card-info__text'>{moment(voteTimestamp).format('lll')}</p>
      </div>
    );
  }, [voteData]);

  useHandleReduxQuerySuccess({
    isSuccess,
    response: data,
    onSuccess: () => {
      if (data) handleVerifySuccess(data.data);
    },
  });
  useHandleReduxQueryError({
    error,
    isError,
    refetch: () => {
      if (originalArgs) verifyVote(originalArgs);
    },
  });

  return (
    <div className='right-aside sm:!px-[30%] !animate-none'>
      <div className='form-header'>
        <p className='form-heading'>Verify Vote</p>
        <p className='form-sub-heading'>Check the integrity of your vote</p>
      </div>

      <Formik
        initialValues={{ voteID: '' }}
        onSubmit={values => verifyVote(values)}
        validationSchema={object({
          voteID: string()
            .matches(REGEX_RULES.ID, 'Please enter a valid Vote ID')
            .required('Please enter a Vote ID'),
        })}
      >
        {({ values, errors, touched, handleBlur, handleChange, handleSubmit }) => (
          <form className='form' onSubmit={handleSubmit}>
            <TextField
              id='voteID'
              type='text'
              name='voteID'
              label='Vote ID'
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.voteID}
              error={touched.voteID && !!errors.voteID}
              helperText={touched.voteID && errors.voteID}
              className='form-field'
            />

            <Button type='submit' variant='contained' loading={isLoading} className='!mt-3'>
              Verify
            </Button>

            <div className='text-center text-gull-gray font-medium text-base -tracking-[0.5%]'>
              <p>
                Didn't receive an email from us with your Vote ID? Check your&nbsp;
                <Link to={PATHS.NOTIFICATIONS} className='text-primary-700 inline-block'>
                  notifications
                </Link>
              </p>
            </div>
          </form>
        )}
      </Formik>

      <AlertDialog
        affirmationOnly
        open={alertOpen}
        setOpen={setAlertOpen}
        affirmativeText='Close'
        dialogTitle='Vote Details'
        dialogContent={dialogContent}
        onClose={() => setVoteData(undefined)}
      />
    </div>
  );
};
export default VerifyVote;

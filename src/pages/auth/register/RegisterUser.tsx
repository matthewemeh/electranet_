import { useNavigate, useSearchParams } from 'react-router-dom';
import { createContext, useRef, useState, useEffect, useCallback } from 'react';

import { PATHS } from '../../../routes/PathConstants';
import { useAppSelector } from '../../../hooks/useRootStorage';
import { useLazySendOtpQuery } from '../../../services/apis/authApi';
import { useHandleReduxQueryError } from '../../../hooks/useHandleReduxQuery';
import {
  BackButton,
  StepTracker,
  RegisterUserOTP,
  RegisterUserDetails,
  RegisterUserPassword,
} from '../../../components';

type StageProp = {
  form: React.ReactNode;
  title: React.ReactNode;
  subtitle: React.ReactNode;
};

export enum Stage {
  BASIC_INFO = 0,
  CARD_INFO = 1,
  PASSWORD = 2,
  OTP = 3,
}

export const RegisterContext = createContext<RegisterUserContext | null>(null);

const Register = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const registerPayload = useRef<RegisterUserPayload>({
    vin: '',
    email: '',
    address: '',
    password: '',
    lastName: '',
    firstName: '',
    occupation: '',
    dateOfBirth: '',
    delimitationCode: '',
  });
  const [stage, setStage] = useState(Stage.BASIC_INFO);
  const [sendOtp, { error, isError }] = useLazySendOtpQuery();
  const {
    isAuthenticated,
    currentUser: { email },
  } = useAppSelector(state => state.authStore);

  const navigateOtpSection = () => setStage(Stage.OTP);

  const navigateCardSection = () => setStage(Stage.CARD_INFO);

  const navigateDetailsSection = () => setStage(Stage.BASIC_INFO);

  const navigatePasswordSection = () => {
    stageProps.current[2].subtitle = (
      <>
        Please enter the one-time password (OTP) sent to&nbsp;
        <span className='font-bold text-primary-700'>{registerPayload.current.email}</span>
      </>
    );
    setStage(Stage.PASSWORD);
  };

  const goBack = useCallback(() => {
    if (stage === 0) {
      navigate(PATHS.AUTH.LOGIN);
      return;
    }
    setStage(prev => prev - 1);
  }, [stage]);

  const stageProps = useRef<StageProp[]>([
    {
      title: 'Your Bio details',
      subtitle: 'Please provide your name and email',
      form: <RegisterUserDetails />,
    },
    {
      title: 'Your Card details',
      subtitle: 'Please provide your card information',
      form: <RegisterUserDetails />,
    },
    {
      title: 'Create your password',
      subtitle: 'Your password should be strong and easy to remember',
      form: <RegisterUserPassword />,
    },
    {
      title: 'Verify your email address',
      subtitle: <></>,
      form: <RegisterUserOTP />,
    },
  ]);

  const checkpoints: Checkpoint[] = [
    { title: 'Your details', subtitle: 'Please provide your name and email' },
    { title: 'Your Card details', subtitle: 'Please provide your card information' },
    { title: 'Create your password', subtitle: 'Must be at least 8 characters' },
    { title: 'Verify your email address', subtitle: 'Increase your account security' },
  ];

  useEffect(() => {
    // user was re-directed here (register page) after a successful login because email hasn't been verified
    if (searchParams.get('stage') === `${Stage.OTP}` && email) {
      sendOtp({ email, subject: 'Electranet: OTP Verification' });
      registerPayload.current.email = email;
      stageProps.current[2].subtitle = (
        <>
          Please enter the one-time password (OTP) sent to&nbsp;
          <span className='font-bold text-primary-700'>{email}</span>
        </>
      );
      navigateOtpSection();
    }
  }, [searchParams]);

  useHandleReduxQueryError({ error, isError });

  return (
    <RegisterContext.Provider
      value={{
        registerPayload,
        navigateOtpSection,
        navigateCardSection,
        navigateDetailsSection,
        navigatePasswordSection,
      }}
    >
      <StepTracker checkpoints={checkpoints} currentStep={stage} />
      <div className='right-aside'>
        <div className='form-header'>
          <BackButton disabled={isAuthenticated} onClick={goBack} />
          <p className='form-heading'>{stageProps.current[stage].title}</p>
          <p className='form-sub-heading'>{stageProps.current[stage].subtitle}</p>
        </div>
        {stageProps.current[stage].form}
      </div>
    </RegisterContext.Provider>
  );
};

export default Register;

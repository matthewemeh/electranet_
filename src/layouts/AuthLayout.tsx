import { Suspense, useEffect } from 'react';
import { Outlet, useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import { Banner, Loading } from '../components';
import { PATHS } from '../routes/PathConstants';
import { useAppSelector } from '../hooks/useRootStorage';
import { Stage as UserStage } from '../pages/auth/register/RegisterUser';
import { Stage as AdminStage } from '../pages/auth/register/RegisterAdmin';

const AuthLayout = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [searchParams] = useSearchParams();
  const { isAuthenticated } = useAppSelector(state => state.authStore);
  const {
    DASHBOARD,
    AUTH: { LOGIN, REGISTER_ADMIN, REGISTER_USER },
  } = PATHS;

  useEffect(() => {
    if (
      isAuthenticated &&
      (pathname === LOGIN ||
        (pathname === REGISTER_ADMIN && searchParams.get('stage') !== `${AdminStage.OTP}`) ||
        (pathname === REGISTER_USER && searchParams.get('stage') !== `${UserStage.OTP}`))
    ) {
      const externalIntent = searchParams.get('external-intent');
      externalIntent ? navigate(externalIntent) : navigate(DASHBOARD);
    }
  }, [pathname, searchParams, isAuthenticated]);

  return (
    <main className='auth relative h-screen overflow-hidden grid grid-cols-1 md:grid-cols-[40%_60%]'>
      <Banner />
      <Suspense fallback={<Loading />}>
        <Outlet />
      </Suspense>
    </main>
  );
};

export default AuthLayout;

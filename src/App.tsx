import { useEffect, useMemo } from 'react';
import { RouterProvider, createBrowserRouter, type RouteObject } from 'react-router-dom';

import { authRoutes } from './routes';
import MainPage404 from './pages/Page404';
import * as userRoutes from './routes/user';
import * as adminRoutes from './routes/admin';
import AuthPage404 from './pages/auth/Page404';
import { PATHS } from './routes/PathConstants';
import { logout } from './services/apis/authApi/store';
import * as superAdminRoutes from './routes/superAdmin';
import { AuthLayout, MainLayout, MuiLayout } from './layouts';
import { useAppDispatch, useAppSelector } from './hooks/useRootStorage';

const App = () => {
  const dispatch = useAppDispatch();
  const { prefersDarkMode, currentUser, isAuthenticated } = useAppSelector(
    state => state.authStore
  );

  useEffect(() => {
    document.body.setAttribute('data-theme', prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const getRoutesFrom = (routeModules: Record<string, RouteObject[]>): RouteObject[] =>
    Object.values(routeModules).flat();

  const routes: RouteObject[] = useMemo(() => {
    if (currentUser.role === 'USER') {
      return getRoutesFrom(userRoutes);
    } else if (currentUser.role === 'ADMIN') {
      return getRoutesFrom(adminRoutes);
    } else {
      return getRoutesFrom(superAdminRoutes);
    }
  }, [currentUser.role]);

  useEffect(() => {
    if (isAuthenticated) return;

    const { pathname, search } = window.location;
    const isAuthPage = pathname.startsWith('/auth');
    const isHome = pathname === '/';

    if (!isAuthPage && !isHome) {
      // Save intent and redirect to login
      const urlIntent = encodeURIComponent(pathname + search);
      window.location.href = `${PATHS.AUTH.LOGIN}?external-intent=${urlIntent}`;
    } else if (!isAuthPage) {
      // Not home, not auth page → force logout
      dispatch(logout());
      window.location.href = PATHS.AUTH.LOGIN;
    }
  }, [isAuthenticated]);

  const router = createBrowserRouter([
    {
      children: routes,
      element: <MainLayout />,
      errorElement: <MainPage404 />,
    },
    {
      children: authRoutes,
      element: <AuthLayout />,
      errorElement: <AuthPage404 />,
    },
  ]);

  return (
    <MuiLayout>
      <RouterProvider router={router} />
    </MuiLayout>
  );
};

export default App;

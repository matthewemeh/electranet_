import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';
const Logs = lazy(() => import('../pages/logs/Logs'));
const Users = lazy(() => import('../pages/users/Users'));
const Tokens = lazy(() => import('../pages/tokens/Tokens'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardAdmin'));

const { DASHBOARD, LOGS, TOKENS, USERS } = PATHS;

const superAdminRoutes: RouteObject[] = [
  { path: DASHBOARD, element: <Dashboard />, index: true },
  { path: LOGS, element: <Logs /> },
  { path: USERS, element: <Users /> },
  { path: TOKENS, element: <Tokens /> },
];

export default superAdminRoutes;

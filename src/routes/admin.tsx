import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';
const Logs = lazy(() => import('../pages/logs/Logs'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardAdmin'));

const { DASHBOARD, LOGS } = PATHS;

const adminRoutes: RouteObject[] = [
  { path: DASHBOARD, element: <Dashboard />, index: true },
  { path: LOGS, element: <Logs /> },
];

export default adminRoutes;

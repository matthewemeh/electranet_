import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';
const Logs = lazy(() => import('../pages/logs/Logs'));
const Contestants = lazy(() => import('../pages/contestants'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardAdmin'));
const ContestantAdd = lazy(() => import('../pages/contestants/ContestantAdd'));
const ContestantUpdate = lazy(() => import('../pages/contestants/ContestantUpdate'));

const { CONTESTANTS, DASHBOARD, LOGS } = PATHS;

const adminRoutes: RouteObject[] = [
  { path: DASHBOARD, element: <Dashboard />, index: true },
  { path: LOGS, element: <Logs /> },
  { path: CONTESTANTS.FETCH, element: <Contestants /> },
  { path: CONTESTANTS.ADD, element: <ContestantAdd /> },
  { path: CONTESTANTS.EDIT, element: <ContestantUpdate /> },
];

export default adminRoutes;

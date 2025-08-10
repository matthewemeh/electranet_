import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';
const Logs = lazy(() => import('../pages/logs/Logs'));
const Parties = lazy(() => import('../pages/parties'));
const Contestants = lazy(() => import('../pages/contestants'));
const PartyAdd = lazy(() => import('../pages/parties/PartyAdd'));
const PartyUpdate = lazy(() => import('../pages/parties/PartyUpdate'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardAdmin'));
const ContestantAdd = lazy(() => import('../pages/contestants/ContestantAdd'));
const ContestantUpdate = lazy(() => import('../pages/contestants/ContestantUpdate'));

const { CONTESTANTS, DASHBOARD, LOGS, PARTIES } = PATHS;

const adminRoutes: RouteObject[] = [
  { path: DASHBOARD, element: <Dashboard />, index: true },
  { path: LOGS, element: <Logs /> },
  { path: PARTIES.ADD, element: <PartyAdd /> },
  { path: PARTIES.FETCH, element: <Parties /> },
  { path: PARTIES.EDIT, element: <PartyUpdate /> },
  { path: CONTESTANTS.FETCH, element: <Contestants /> },
  { path: CONTESTANTS.ADD, element: <ContestantAdd /> },
  { path: CONTESTANTS.EDIT, element: <ContestantUpdate /> },
];

export default adminRoutes;

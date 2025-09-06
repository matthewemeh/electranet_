import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';
const Logs = lazy(() => import('../pages/logs'));
const Votes = lazy(() => import('../pages/votes'));
const Results = lazy(() => import('../pages/results'));
const Parties = lazy(() => import('../pages/parties'));
const Elections = lazy(() => import('../pages/elections'));
const Result = lazy(() => import('../pages/results/Result'));
const Contestants = lazy(() => import('../pages/contestants'));
const PartyAdd = lazy(() => import('../pages/parties/PartyAdd'));
const Notifications = lazy(() => import('../pages/notifications'));
const PartyUpdate = lazy(() => import('../pages/parties/PartyUpdate'));
const ElectionAdd = lazy(() => import('../pages/elections/ElectionAdd'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardAdmin'));
const ElectionUpdate = lazy(() => import('../pages/elections/ElectionUpdate'));
const ContestantAdd = lazy(() => import('../pages/contestants/ContestantAdd'));
const ContestantUpdate = lazy(() => import('../pages/contestants/ContestantUpdate'));
const ElectionContestants = lazy(() => import('../pages/elections/ElectionContestants'));

const { CONTESTANTS, DASHBOARD, ELECTIONS, LOGS, NOTIFICATIONS, PARTIES, RESULTS, VOTES } = PATHS;

const adminRoutes: RouteObject[] = [
  { path: DASHBOARD, element: <Dashboard />, index: true },
  { path: LOGS, element: <Logs /> },
  { path: VOTES.FETCH, element: <Votes /> },
  { path: PARTIES.ADD, element: <PartyAdd /> },
  { path: PARTIES.FETCH, element: <Parties /> },
  { path: RESULTS.FETCH, element: <Results /> },
  { path: RESULTS.RESULT, element: <Result /> },
  { path: PARTIES.EDIT, element: <PartyUpdate /> },
  { path: ELECTIONS.FETCH, element: <Elections /> },
  { path: ELECTIONS.ADD, element: <ElectionAdd /> },
  { path: NOTIFICATIONS, element: <Notifications /> },
  { path: CONTESTANTS.FETCH, element: <Contestants /> },
  { path: CONTESTANTS.ADD, element: <ContestantAdd /> },
  { path: ELECTIONS.EDIT, element: <ElectionUpdate /> },
  { path: CONTESTANTS.EDIT, element: <ContestantUpdate /> },
  { path: ELECTIONS.CONTESTANTS, element: <ElectionContestants /> },
];

export default adminRoutes;

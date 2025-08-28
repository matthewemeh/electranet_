import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';
const UserElections = lazy(() => import('../pages/user-elections'));
const Election = lazy(() => import('../pages/user-elections/Election'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardUser'));

const { DASHBOARD, ELECTIONS, FACE_ID_REGISTER } = PATHS;

const userRoutes: RouteObject[] = [
  { path: DASHBOARD, element: <Dashboard />, index: true },
  { path: ELECTIONS.FETCH, element: <UserElections /> },
  { path: ELECTIONS.ELECTION_RESULTS, element: <></> },
  { path: ELECTIONS.ELECTION, element: <Election /> },
  { path: FACE_ID_REGISTER, element: <></> },
];

export default userRoutes;

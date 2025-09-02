import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';
const UserElections = lazy(() => import('../pages/user-elections'));
const Election = lazy(() => import('../pages/user-elections/Election'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardUser'));

const { DASHBOARD, ELECTIONS, FACE_ID_REGISTER, RESULTS } = PATHS;

const userRoutes: RouteObject[] = [
  { path: DASHBOARD, element: <Dashboard />, index: true },
  { path: RESULTS.FETCH, element: <>Results</> },
  { path: RESULTS.RESULT, element: <>Result</> },
  { path: ELECTIONS.ELECTION, element: <Election /> },
  { path: ELECTIONS.FETCH, element: <UserElections /> },
  { path: FACE_ID_REGISTER, element: <>Face ID Registration</> },
];

export default userRoutes;

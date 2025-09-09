import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';
const Votes = lazy(() => import('../pages/votes'));
const Results = lazy(() => import('../pages/results'));
const Result = lazy(() => import('../pages/results/Result'));
const FaceRegister = lazy(() => import('../pages/FaceRegister'));
const VerifyVote = lazy(() => import('../pages/votes/VerifyVote'));
const Notifications = lazy(() => import('../pages/notifications'));
const UserElections = lazy(() => import('../pages/user-elections'));
const Election = lazy(() => import('../pages/user-elections/Election'));
const Dashboard = lazy(() => import('../pages/dashboard/DashboardUser'));

const { DASHBOARD, ELECTIONS, FACE_ID_REGISTER, NOTIFICATIONS, RESULTS, VOTES } = PATHS;

const userRoutes: RouteObject[] = [
  { path: DASHBOARD, element: <Dashboard />, index: true },
  { path: VOTES.FETCH, element: <Votes /> },
  { path: RESULTS.FETCH, element: <Results /> },
  { path: RESULTS.RESULT, element: <Result /> },
  { path: VOTES.VERIFY, element: <VerifyVote /> },
  { path: ELECTIONS.ELECTION, element: <Election /> },
  { path: NOTIFICATIONS, element: <Notifications /> },
  { path: ELECTIONS.FETCH, element: <UserElections /> },
  { path: FACE_ID_REGISTER, element: <FaceRegister /> },
];

export default userRoutes;

import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { PATHS } from './PathConstants';
const Dashboard = lazy(() => import('../pages/dashboard/DashboardUser'));

const { DASHBOARD } = PATHS;

const userRoutes: RouteObject[] = [{ path: DASHBOARD, element: <Dashboard />, index: true }];

export default userRoutes;

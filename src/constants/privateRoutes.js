import AuthorizePage from '../pages/AuthorizePage';
import ProfilePage from '../pages/ProfilePage';
import SettingsPage from '../pages/SettingsPage';
import DashboardPage from '../pages/DashboardPage';
import ViewScanPage from '../pages/ViewScanPage';
import ScanningPage from '../pages/ScanningPage';
import ViewConfirmedReturnPage from '../pages/ViewConfirmedReturn';
import EditOrderPage from '../pages/EditOrder';

// const DashboardPage = lazy(() => import('../pages/DashboardPage'));
// const ViewScanPage = lazy(() => import('../pages/ViewScanPage'));
// const ScanningPage = lazy(() => import('../pages/ScanningPage'));
// const ViewConfirmedReturnPage = lazy(() =>
//   import('../pages/ViewConfirmedReturn')
// );
// const EditOrderPage = lazy(() => import('../pages/EditOrder'));

export default [
  { path: '/request-permission', component: AuthorizePage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/view-scan', component: ViewScanPage },
  { path: '/scanning', component: ScanningPage },
  { path: '/profile', component: ProfilePage },
  { path: '/settings', component: SettingsPage },
  { path: '/view-return', component: ViewConfirmedReturnPage },
  { path: '/edit-order', component: EditOrderPage },
];

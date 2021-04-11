import AuthorizePage from '../pages/AuthorizePage';
import ProfilePage from '../pages/Profile/ProfilePage';
import SettingsPage from '../pages/Settings/SettingsPage';
import DashboardPage from '../pages/Dashboard/DashboardPage';
import ViewScanPage from '../pages/ViewScan/ViewScanPage';
import ViewConfirmedReturnPage from '../pages/ViewConfirmedReturn/ViewConfirmedReturn';
import EditOrderPage from '../pages/EditOrder/EditOrder';

export default [
  { path: '/request-permission', component: AuthorizePage },
  { path: '/dashboard', component: DashboardPage },
  { path: '/view-scan', component: ViewScanPage },
  { path: '/profile', component: ProfilePage },
  { path: '/settings', component: SettingsPage },
  { path: '/view-return', component: ViewConfirmedReturnPage },
  { path: '/edit-order', component: EditOrderPage },
];

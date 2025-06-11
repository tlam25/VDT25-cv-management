import { useRoutes, Navigate } from 'react-router-dom';

import LoginLayout from '../layouts/LoginLayout';
import LoginPage from '../pages/LoginPage';

import AdminLayout from '../layouts/AdminLayout';
import AdminEmployeesList from '../pages/AdminPage/AdminEmployeesList';

import PMLayout from '../layouts/PMLayout';
import PMEmployeesList from '../pages/PMPage/PMEmployeesList';

import LeaderLayout from '../layouts/LeaderLayout';
import LeaderEmployeesList from '../pages/LeaderPage/LeaderEmployeesList';

import StaffLayout from '../layouts/StaffLayout';
import StaffEmployeesList from '../pages/StaffPage/StaffEmployeesList';

import AdminCvView from '../pages/AdminPage/AdminEmployeesList/AdminCvView';
import LeaderCvView from '../pages/LeaderPage/LeaderEmployeesList/LeaderCvView';
import PMCvView from '../pages/PMPage/PMEmployeesList/PMCvView';
import StaffCvView from '../pages/StaffPage/StaffEmployeesList/StaffCvView';

import LeaderNotificationList from '../pages/LeaderPage/LeaderNotificationsList';
import PMNotificationList from '../pages/PMPage/PMNotificationsList';
import StaffNotificationList from '../pages/StaffPage/StaffNotificationsList';

import LeadMe from '../pages/LeaderPage/Me';
import PMMe from '../pages/PMPage/Me';

const AppRoutes = () => {
    const routes = [
        {
            path: '/',
            element: <LoginLayout />,
            children: [
                {element: <LoginPage />, index: true},
            ],
        },
        {
            path: '/admin',
            element: <AdminLayout />,
            children: [
                { 
                    path: 'employeeslist', 
                    element: <AdminEmployeesList /> 
                },
                { 
                    path: 'employeeslist/cv/:emp_id', 
                    element: <AdminCvView /> 
                },
            ],
        },
        {
            path: '/pm',
            element: <PMLayout />,
            children: [
                {
                    path: 'me', 
                    element: <PMMe />
                },
                {
                    path: 'me/cv/:emp_id', 
                    element: <PMCvView />
                },
                {
                    path: 'employeeslist', 
                    element: <PMEmployeesList />
                },
                {
                    path: 'notifications',
                    element: <PMNotificationList />
                },
                {
                    path: 'employeeslist/cv/:emp_id', 
                    element: <PMCvView />
                },
            ],
        },
        {
            path: '/lead',
            element: <LeaderLayout />,
            children: [
                {
                    path: 'me', 
                    element: <LeadMe />
                },
                {
                    path: 'me/cv/:emp_id', 
                    element: <LeaderCvView />
                },
                {
                    path: 'employeeslist', 
                    element: <LeaderEmployeesList />
                },
                {
                    path: 'notifications',
                    element: <LeaderNotificationList />
                },
                { 
                    path: 'employeeslist/cv/:emp_id', 
                    element: <LeaderCvView /> 
                },
            ],
        },
        {
            path: '/staff',
            element: <StaffLayout />,
            children: [
                {
                    path: 'employeeslist', 
                    element: <StaffEmployeesList />
                },
                {
                    path: 'notifications',
                    element: <StaffNotificationList />
                },
                { 
                    path: 'employeeslist/cv/:emp_id', 
                    element: <StaffCvView /> 
                },
            ],
        },
        // Route wildcard để bắt mọi đường dẫn không hợp lệ
        {
            path: '*',
            element: <Navigate to="/" replace />
        },
    ];

    const routing = useRoutes(routes);
    return routing;
}

export default AppRoutes;
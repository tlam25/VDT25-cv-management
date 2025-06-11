import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuBar from '../../components/MenuBar';

import useAuthGuard from '../../utils/UseAuthGuard';
import fetchWithAuth from '../../utils/FetchWithAuth';

import { useState, useEffect } from 'react';
import './StaffLayout.css';

import { Outlet } from 'react-router-dom';

const API = "http://127.0.0.1:8000";

const StaffLayout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    useAuthGuard(['Staff']);

    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await fetchWithAuth(`${API}/notifications/unread_count`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Không thể lấy số lượng thông báo chưa đọc!');
                }

                const data = await response.json();
                setUnreadCount(data.unread_count ?? 0);
            }
            catch (err) {
                setUnreadCount(0);
            }
        };

        fetchUnreadCount();
    }, []);

    return (
        <div className="staff-layout">
            <Header />

            <MenuBar role='staff' unreadCount={unreadCount}/>

            <div className="staff-content">
                <Outlet />
            </div>
            
            <Footer />
        </div>
    );
};

export default StaffLayout;
import NotificationsList from '../../../components/NotificationsList';
import { useState, useEffect } from 'react';
import fetchWithAuth from '../../../utils/FetchWithAuth';

const API = "http://127.0.0.1:8000";

const PMNotificationsList = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetchWithAuth(`${API}/notifications/?limit=10&offset=0`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách thông báo!');
                }

                const data = await response.json();
                setNotifications(data.notifications || []);
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (noti, value) => {
        if (noti.is_read === value) return;

        try {
            const res = await fetchWithAuth(`${API}/notifications/${noti.notification_id}/read`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_read: value })
            });

            if (!res.ok) {
                throw new Error('Không thể đánh dấu thông báo là đã đọc!');
            }

            setNotifications(prev =>
                prev.map(item =>
                    item.notification_id === noti.notification_id
                        ? { ...item, is_read: value }
                        : item
                )
            );
        } catch (err) {
            alert(err.message);
        }
    }

    if (loading) return <p>Đang tải...</p>;
    if (error) return <p>Lỗi: {error}</p>;

    return (
        <div>
            <NotificationsList
                notifications={notifications}
                title="Thông báo yêu cầu cập nhật CV của bạn"
                onMarkAsRead={handleMarkAsRead}
            />
        </div>
    );
};

export default PMNotificationsList;
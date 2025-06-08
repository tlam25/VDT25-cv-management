import './NotificationsList.css';

const NotificationsList = ({ notifications, title, onMarkAsRead }) => {
    return (
        <div className="notifications-list-box">
            <h2>{title}</h2>
            {(!notifications || notifications.length === 0) && (
                <div className="no-notifications">Không có thông báo.</div>
            )}
            <div className="notifications-cards">
                {notifications && notifications.length > 0 &&
                    notifications.map((noti) => (
                        <div
                            key={noti.notification_id}
                            className={`notification-card${noti.is_read ? '' : ' unread'}`}
                        >
                            <div className="notification-header">
                                <span className="notification-title">
                                    {noti.sender} 
                                    <span className="notification-role">
                                        {noti.sender_roles && noti.sender_roles.length > 0 ? 
                                            ` (${Array.isArray(noti.sender_roles) ? noti.sender_roles.join(', ') : noti.sender_roles})` 
                                            : ""}
                                    </span>
                                </span>
                                <span className={`notification-status status-${noti.status?.toLowerCase()}`}>
                                    {noti.status}
                                </span>
                            </div>
                            <div className="notification-message">
                                {noti.message || "(Không có nội dung)"}
                            </div>
                            <div className="notification-footer">
                                <span className="notification-date">
                                    {noti.date ? new Date(noti.date).toLocaleDateString('vi-VN') : ''}
                                </span>
                                {noti.is_read ? (
                                    <button
                                        className="mark-read-btn"
                                        onClick={() => onMarkAsRead && onMarkAsRead(noti, false)}
                                    >
                                        Đánh dấu là chưa đọc
                                    </button>
                                ) : (
                                    <button
                                        className="mark-read-btn"
                                        onClick={() => onMarkAsRead && onMarkAsRead(noti, true)}
                                    >
                                        Đánh dấu đã đọc
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};

export default NotificationsList;
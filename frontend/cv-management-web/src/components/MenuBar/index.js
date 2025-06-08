import './MenuBar.css';
import { Link, useLocation, useNavigate  } from 'react-router-dom';
import { useState } from 'react';

import { 
    FaUser, 
    FaBell, 
    FaUserFriends, 
    FaSignOutAlt 
} from 'react-icons/fa';

const MenuBar = ({ role }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    const handleLogoutClick = () => {
        setShowLogoutConfirm(true);
    };

    const confirmLogout = () => {
        setShowLogoutConfirm(false);
        localStorage.removeItem('user');
        navigate('/');
    };

    const cancelLogout = () => {
        setShowLogoutConfirm(false);
    };

    const menuItems = {
    admin: [
        { name: 'Danh sách nhân viên', icon: <FaUserFriends />, path: 'employeeslist' },
        { name: 'Đăng xuất', icon: <FaSignOutAlt  />, isLogout: true },
    ],
    lead: [
        { name: 'CV của bạn', icon: <FaUser />, path: 'me' },
        { name: 'Danh sách nhân viên', icon: <FaUserFriends />, path: 'employeeslist' },
        { name: 'Thông báo', icon: <FaBell />, path: 'notifications' },
        { name: 'Đăng xuất', icon: <FaSignOutAlt  />, isLogout: true },
    ],
    pm: [
        { name: 'CV của bạn', icon: <FaUser />, path: 'me' },
        { name: 'Danh sách nhân viên', icon: <FaUserFriends />, path: 'employeeslist' },
        { name: 'Thông báo', icon: <FaBell />, path: 'notifications' },
        { name: 'Đăng xuất', icon: <FaSignOutAlt  />, isLogout: true },
    ],
    staff: [
        { name: 'CV của bạn', icon: <FaUser />, path: 'employeeslist' },
        { name: 'Thông báo', icon: <FaBell />, path: 'notifications' },
        { name: 'Đăng xuất', icon: <FaSignOutAlt  />, isLogout: true },
    ],
    };

    const items = menuItems[role] || [];

    return (
    <div className="menu-bar">
        <div className="menu-items">
            {items.map((item, index) => {
                let isActive = false;
                if (item.path) {
                    // ktra neu path hien tai co chua item.path
                    isActive =
                        location.pathname.endsWith(item.path) ||
                        (item.path === 'employeeslist' && location.pathname.includes('employeeslist'));
                } else {
                    isActive = location.pathname === '/';
                }
                
                if (item.isLogout) {
                return (
                    <div 
                        key={index} 
                        className="menu-item logout-item" 
                        onClick={handleLogoutClick}
                    >
                        <div className="menu-icon">{item.icon}</div>
                        <div className="menu-label">{item.name}</div>
                    </div>
                );
                }

                return (
                <Link 
                    to={item.path} 
                    key={index} 
                    className={`menu-item ${isActive ? 'active' : ''}`}
                >
                    <div className="menu-icon">{item.icon}</div>
                    <div className="menu-label">{item.name}</div>
                </Link>
                );
            })}
        </div>

        {showLogoutConfirm && (
            <div className="logout-confirm-popup">
                <div className="popup-content-out">
                    <p>Bạn có chắc chắn muốn đăng xuất?</p>
                    <button onClick={confirmLogout}>Đồng ý</button>
                    <button onClick={cancelLogout}>Hủy</button>
                </div>
            </div>
        )}

    </div>
    );
};

export default MenuBar;
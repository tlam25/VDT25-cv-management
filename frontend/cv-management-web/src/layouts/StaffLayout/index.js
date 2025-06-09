import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuBar from '../../components/MenuBar';
import useAuthGuard from '../../utils/UseAuthGuard';

import './StaffLayout.css';

import { Outlet } from 'react-router-dom';

const StaffLayout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    useAuthGuard(['Staff']);

    return (
        <div className="staff-layout">
            <Header />

            <MenuBar role='staff' />

            <div className="staff-content">
                <Outlet />
            </div>
            
            <Footer />
        </div>
    );
};

export default StaffLayout;
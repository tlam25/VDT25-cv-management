import Header from '../../components/Header';
import Footer from '../../components/Footer';
import MenuBar from '../../components/MenuBar';
import useAuthGuard from '../../utils/UseAuthGuard';

import { Outlet } from 'react-router-dom';

import './LeaderLayout.css';

const LeaderLayout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    useAuthGuard(['Leader']);

    return (
        <div className="leader-layout">
            <Header />

            <MenuBar role='lead' />

            <div className="leader-content">
                <div className="leader-greeting">
                    <p>Xin chào: {user?.first_name}</p>
                </div>
                <Outlet />
            </div>

            <Footer />
        </div>
    );
};

export default LeaderLayout;